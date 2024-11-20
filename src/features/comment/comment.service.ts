import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from '@/core/database/database.service';
import { Comment } from './entities/comment.entity';
import { ResponseSuccess, ResponseError } from '@/common/response/response';

@Injectable()
export class CommentService {
  constructor(private prisma: DatabaseService) {}

  // Create a new comment or reply
  async createComment(data: CreateCommentDto): Promise<Comment> {
    return this.prisma.comment.create({
      data,
      include: { replies: true }, // Includes replies when returning the created comment
    });
  }

  // Find a comment by ID, with nested replies
  async findCommentById(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
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
    if (!comment)
      throw new NotFoundException(`Comment with Id ${id} not found`);
    return comment;
  }

  // Find all comments for a specific article, including nested replies
  async findCommentsByArticle(
    articleId: string,
  ): Promise<ResponseSuccess<Comment[]> | ResponseError<any>> {
    try {
      const data = await this.prisma.comment.findMany({
        where: { articleId, parentId: null }, // Retrieves only top-level comments for the article
        include: { replies: true },
      });
      if (!data) {
        return new ResponseError('No data found', null, {
          message: 'Data is empty',
        });
      }
      return new ResponseSuccess('Data retrieved successfully', data);
    } catch (error) {
      return new ResponseError('Failed to retrieve data', null, error);
    }
  }

  // Update a comment
  async updateComment(id: string, data: UpdateCommentDto): Promise<Comment> {
    const comment = await this.prisma.comment.update({
      where: { id },
      data,
    });
    if (!comment)
      throw new NotFoundException(`Comment with ID ${id} not found`);
    return comment;
  }

  // Delete a comment by ID
  async deleteComment(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment)
      throw new NotFoundException(`Comment with ID ${id} not found`);

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
