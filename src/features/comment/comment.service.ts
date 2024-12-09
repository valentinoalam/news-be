import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Comment } from './entities/comment.entity';
import { ICommentService } from '@/shared/interfaces/comment.interface';
import {
  getPaginatedData,
  getPaginationParams,
  PaginatedResponse,
  PaginationParams,
} from '@/shared/utils/pagination.util';

@Injectable()
export class CommentService implements ICommentService {
  constructor(private prisma: DatabaseService) {}

  async createComment(userId: string, data: CreateCommentDto) {
    const { content, articleId, parentId } = data;

    // Verify article exists
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parentComment || parentComment.articleId !== article.id) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    return this.prisma.comment.create({
      data: {
        content,
        articleId: articleId,
        authorId: userId,
        parentId: parentId || undefined,
      },
      include: {
        author: {
          select: {
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        parent: true,
      },
    });
  }

  async updateComment(
    userId: string,
    commentId: string,
    data: UpdateCommentDto,
  ) {
    // Verify comment exists and user is the author
    const existingComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    if (existingComment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: data.content,
      },
    });
  }

  async deleteComment(userId: string, commentId: string) {
    // Verify comment exists and user is the author
    const existingComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    if (existingComment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Soft delete by updating content
    // return this.prisma.comment.update({
    //   where: { id: commentId },
    //   data: {
    //     content: '[Deleted]'
    //   }
    // });
    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async findCommentById(id: string): Promise<Comment> {
    return await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        article: {
          select: {
            title: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getCommentsByArticle(articleId: number, params: PaginationParams) {
    const { skip, limit, orderBy } = getPaginationParams(params);

    const query = {
      where: {
        articleId,
        parentId: null, // Count only top-level comments
      },
      include: {
        author: {
          select: {
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    name: true,
                    profile: {
                      select: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy,
    };

    const paginatedComments: PaginatedResponse<Comment> =
      await getPaginatedData(
        this.prisma,
        'comment',
        query,
        params.page,
        limit,
        skip,
      );
    return paginatedComments;
  }

  async createReply(userId: string, dto: CreateCommentDto) {
    const { content, articleId, parentId } = dto;

    // Validate parent comment
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    // Ensure the article matches
    if (parentComment.articleId !== articleId) {
      throw new BadRequestException(
        'Reply must be to a comment in the same article',
      );
    }

    // Optional: Add depth limit for nested replies if needed
    const replyDepth = await this.getCommentDepth(parentId);
    if (replyDepth >= 3) {
      // Limit to 3 levels of nesting
      throw new BadRequestException('Maximum reply depth reached');
    }

    // Create the reply
    return this.prisma.comment.create({
      data: {
        content,
        articleId: articleId,
        authorId: userId,
        parentId: parentId,
      },
      include: {
        author: {
          select: {
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        parent: true,
      },
    });
  }

  // Helper method to get the depth of a comment in the reply tree
  async getCommentDepth(commentId: string, currentDepth: number = 0) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { parentId: true },
    });

    if (!comment || !comment.parentId) {
      return currentDepth;
    }

    return this.getCommentDepth(comment.parentId, currentDepth + 1);
  }

  // Enhanced method to fetch comments with full nested structure
  async getNestedComments(articleId: number, params: PaginationParams) {
    const { skip, limit, orderBy } = getPaginationParams(params);

    const query = {
      where: {
        articleId,
        parentId: null,
      },
      include: {
        author: {
          select: {
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    name: true,
                    profile: {
                      select: {
                        avatar: true,
                      },
                    },
                  },
                },
                replies: {
                  include: {
                    author: {
                      select: {
                        name: true,
                        profile: {
                          select: {
                            avatar: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy,
    };

    const paginatedComments: PaginatedResponse<Comment> =
      await getPaginatedData(
        this.prisma,
        'comment',
        query,
        params.page,
        limit,
        skip,
      );
    return paginatedComments;
  }

  // Method to get all replies to a specific comment
  async getRepliesForComment(commentId: string) {
    return this.prisma.comment.findMany({
      where: {
        parentId: commentId,
      },
      include: {
        author: {
          select: {
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
