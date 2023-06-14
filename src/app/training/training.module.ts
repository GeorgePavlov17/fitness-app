import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; 
import { TrainingComponent } from './training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { StoreModule } from '@ngrx/store';
import { trainigReducer } from './training.reducer';

@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingsComponent,
        StopTrainingComponent
    ],
    imports: [
        SharedModule,
        AngularFirestoreModule,
        TrainingRoutingModule,
        StoreModule.forFeature('training', trainigReducer)
    ],
    exports: []
})
export class TrainingModule {

}