import React, { Component } from 'react';
import { render } from 'react-dom';
import KanbanBoard from './KanbanBoard';
import update from 'react-addons-update';
//Polyfills
import 'babel-polyfill';
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
        
        window.state = this.state;
    }
    
    addTask(cardId, taskName){
        
        // Keep a reference to the original state prior to the mutations
        // in case you need to revert the optimisting changes in the UI
        let prevState = window.state;
        
        // Find the index of the first card 
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        
        // Create a new task with the given name and a temporary ID
        let newTask = {id: Date.now(), name: taskName, done: false};
        
        // set the component state to the mutated object 
        let nextState = update(this.state.cards, {
           [cardIndex]: {
               tasks: {$push: [newTask]}
           } 
        });
        
        // Set the component state to the mutated object 
        this.setState({cards:nextState});
        
        // Call the API to add the task on the server
        fetch(`${API_URL}/cards/${cardId}/tasks`,{
           method: 'post',
           headers: API_HEADERS,
           body: JSON.stringify(newTask) 
        })
        .then((response) => {
            if(response.ok){
                return response.json();
            }
            else{
                throw new Error("Server response wasn't OK");
            }
        })            
        .then((responseData) => {
            // When the server returns the definitive ID
            // used for the new Task on the server, update it in React 
            newTask.id = responseData.id
            this.setState({cards:nextState});
        })
        .catch((error) => {
            this.setState(prevState);
        });
    }
    
    deleteTask(cardId, taskId, taskIndex){
        
        let prevState = this.state;
        
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card) =>card.id == cardId);
         // Create a new object without the task 
         let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]:{
                        done: {
                            $apply:(done) => {
                                newDoneValue = !done
                                return newDoneValue;
                            }                            
                        }
                    }
                }
            } 
         });
         
        this.setState({cards:nextState});
        
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
           method: 'put',
           headers: API_HEADERS,
           body: JSON.stringify({done:newDoneValue}) 
        })
        .then((response) => {
            if(!response.ok){
                throw new Error("Server response wasn't ok");
            }
        })
        .catch((error) => {
            console.error("Fetch error: ", error);
            this.setState(prevState);
        });
    }
    
    toggleTask(cardId, taskId, taskIndex){
        let prevState = this.state;
        
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        
        let newDoneValue;
        
        let nextState = update(this.state.cards, {
           [cardIndex]: {
               tasks: {
                   [taskIndex]: {
                       done: { $apply: (done) => {
                           newDoneValue = !done 
                           return newDoneValue;
                       }}
                   }
               }
           }
        });
        
        this.setState({cards:nextState});
           
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
           method: 'put',
           headers: API_HEADERS,
           body: JSON.stringify({done:newDoneValue}) 
        })
        .then((response) => {
            if(!response.ok){
                throw new Error("Server response wasn't ok");
            }
        })
        .catch((error) => {
           console.error("Fetch error:", error)
           this.setState(prevState); 
        });
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