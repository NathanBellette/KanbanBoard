import AppDispatcher from '../AppDispatcher';
import constants from '../constants'
import KanbanAPI from '../api/KanbanApi';

let TaskActionCreator = {
    addTask(cardId, task){
        AppDispatcher.dispatchAsync(KanbanAPI.addTask(cardId, task), {
            request: constants.CREATE_TASK,
            success: constants.CREATE_TASK_SUCCESS,
            failure: constants.CREATE_TASK_ERROR    
        }, {cardId, task});
    },
    
    deleteTask(cardID, task, taskIndex){
        AppDispatcher.dispatchAsync(KanbanAPI.deleteTask(cardId, task), {
            request: constants.DELETE_TASK,
            success: constants.DELETE_TASK_SUCCESS,
            failure: constants.CREATE_TASK_ERROR
        }, {cardId, task, taskIndex});
    }
};