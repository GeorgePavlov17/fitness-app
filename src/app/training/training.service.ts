import { Subject } from "rxjs";

import { Exercise } from "./exercise.model";

export class TrainingService {
    exerciseChanged = new Subject<Exercise>();

    private availableExercises: Exercise[] = [
        { id: 'biceps', name: 'Biceps', duration: 20, calories: 20 },
        { id: 'triceps', name: 'Triceps', duration: 20, calories: 20 },
        { id: 'back', name: 'Back', duration: 30, calories: 40 },
        { id: 'legs', name: 'Legs', duration: 30, calories: 50 },
    ];

    private runningExercise: Exercise | any;

    getAvailableExercises() {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }
}