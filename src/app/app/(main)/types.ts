import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getUserTodos } from './actions'

export type Todo = {
    id: string;
    title: string;
    userId: string;
    doneAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}