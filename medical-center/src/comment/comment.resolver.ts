import { Resolver, Args, Query, Mutation, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { PatientGuard } from '../shared/patient.guard ';
import { CommentDTO } from './comment.dto';

@Resolver('comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  async comment(@Args('id') doctorId: string) {
    return await this.commentService.showOneDoctorComments(doctorId);
  }

  @Mutation()
  @UseGuards(new AuthGuard(), PatientGuard)
  async createComment(
    @Args('comment') comment,
    @Args('mark') mark,
    @Args('doctor') doctorId: string,
    @Context('patient') patientId: string,
  ) {
    const data: CommentDTO = { comment, mark };
    return await this.commentService.addComment(doctorId, patientId, data);
  }
  @Mutation()
  @UseGuards(new AuthGuard(), PatientGuard)
  async deleteComment(@Args('commentId') commentId: string) {
    return await this.commentService.deleteComment(commentId);
  }
  @Mutation()
  @UseGuards(new AuthGuard(), PatientGuard)
  async updateComment(
    @Args('comment') comment: string,
    @Args('mark') mark: number,
    @Args('commentId') commentId: string,
  ) {
    const data: CommentDTO = { comment, mark };
    return await this.commentService.updateComment(commentId, data);
  }
}
