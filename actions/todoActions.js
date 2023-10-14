import axios from 'axios';

export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const ADD_TODO_SUCCESS = 'ADD_TODO_SUCCESS';
export const UPDATE_TODO_SUCCESS = 'UPDATE_TODO_SUCCESS';
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS';

export const fetchTodosSuccess = (todos) => ({
  type: FETCH_TODOS_SUCCESS,
  payload: todos,
});

export const addTodoSuccess = (todo) => ({
  type: ADD_TODO_SUCCESS,
  payload: todo,
});

export const updateTodoSuccess = (todo) => ({
  type: UPDATE_TODO_SUCCESS,
  payload: todo,
});

export const deleteTodoSuccess = (id) => ({
  type: DELETE_TODO_SUCCESS,
  payload: id,
});

export const fetchTodos = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://your-backend-api/todos');
      dispatch(fetchTodosSuccess(response.data));
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
};

export const addTodo = (todo) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('http://your-backend-api/todos', todo);
      dispatch(addTodoSuccess(response.data));
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
};

// Similar functions for updateTodo and deleteTodo
