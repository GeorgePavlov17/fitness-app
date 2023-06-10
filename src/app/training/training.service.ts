import { Subject } from "rxjs";

import { Exercise } from "./exercise.model";

export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();

    private availableExercises: Exercise[] = [
        { id: 'biceps', name: 'Biceps', duration: 20, calories: 20 },
        { id: 'triceps', name: 'Triceps', duration: 20, calories: 20 },
        { id: 'back', name: 'Back', duration: 30, calories: 40 },
        { id: 'legs', name: 'Legs', duration: 30, calories: 50 },
    ];

    private runningExercise: Exercise | any;
    private exercises: Exercise[] = [];

    getAvailableExercises() {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.exercises.push({...this.runningExercise, date: new Date(), state: 'completed'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.duration * (progress / 100),
            date: new Date(), 
            state: 'cancelled'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }
}