// import { Resolver, Query, Args, Context } from '@nestjs/graphql';
// import { DoctorService } from './doctor.service';
// import { CommentService } from 'src/comment/comment.service';
// import { UseGuards } from '@nestjs/common';
// import { AuthGuard } from 'src/shared/auth.guard';
// import { DoctorGuard } from 'src/shared/doctor.guard';

// @Resolver('Doctor')
// export class DoctorResolver {
//   constructor(
//     private doctorService: DoctorService,
//     private commentService: CommentService,
//   ) {}

//   @Query()
//   doctors() {
//     return this.doctorService.showAll();
//   }

//   @Query()
//   doctor(@Args('id') id: string) {
//     return this.doctorService.showOneDoctor(id);
//   }
//   @Query()
//   @UseGuards(new AuthGuard(),DoctorGuard)
//   whoami(@Context('user') doctor){
//       const {login}
//   }
// }
