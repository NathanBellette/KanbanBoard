import React, { Component } from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';

const API_URL = "http://kanbanapi.pro-react.com";
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: 'asdfqwerty'
}

class KanbanBoardContainer extends Component{
    constructor(){
        super(...arguments);
        this.state = {
            cards:[]
        };
    }
    
    componentDidMount(){
        fetch(API_URL + '/cards', {headers: API_HEADERS})
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({cards: responseData});
        })
        .catch((eror) => {
           console.log('Error fetching and parsing data', error); 
        });
    }
    
    addTask(cardId, taskName){
        
    }
    
    deleteTask(cardId, taskId, taskIndex){
        
    }
    
    toggleTask(cardId, taskId, taskIndex){
        
    }
    
    render(){
        return <KanbanBoard cards={this.state.cards} 
                            taskCallbacks={{
                                toggle: this.toggleTask.bind(this),
                                delete: this.toggleTask.bind(this),
                                add: this.addTask.bind(this) }}/>
    }
}

export default KanbanBoardContainer