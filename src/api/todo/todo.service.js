const CreateTodoDto = require('./dto/create-todo.dto');
const GetTodoDto = require('./dto/get-todo.dto');
const UpdateTodoDto = require('./dto/update-todo.dto');
const TodoEntity = require('./entity/todo.entity');
const TodoNotFoundException = require('./exception/TodoNotFoundException');
const TodoRepository = require('./todo.repository');

module.exports = class TodoService {
    todoRepository;

    /**
     * @param {TodoRepository} todoRepository
     */
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * Get todo by user idx
     *
     * @param {GetTodoDto} getDto
     * @returns {Promise<{
     *  todoList: TodoEntity[]
     * }>}
     */
    async getTodoAll(getDto) {
        const todoList = await this.todoRepository.select({
            page: getDto.page,
            userIdx: getDto.user,
        });

        return todoList.map((todo) => TodoEntity.createToDoEntity(todo));
    }

    /**
     * Create todo
     *
     * @param {number} userIdx
     * @param {CreateTodoDto} createDto
     * @returns {Promise<TodoEntity>}
     */
    async createTodo(userIdx, createDto) {
        const todo = await this.todoRepository.insert(userIdx, {
            title: createDto.title,
            contents: createDto.contents,
        });

        return TodoEntity.createToDoEntity(todo);
    }

    /**
     * Get todo by idx
     *
     * @param {number} idx
     * @returns {Promise<TodoEntity>}
     *
     * @throws {TodoNotFoundException}
     */
    async getTodoByIdx(idx) {
        const todo = await this.todoRepository.selectByIdx(idx);

        if (!todo) {
            throw new TodoNotFoundException('Cannot find todo');
        }

        return TodoEntity.createToDoEntity(todo);
    }

    /**
     * Update todo by idx
     *
     * @param {number} idx
     * @param {UpdateTodoDto} updateDto
     * @returns {Promise<void>}
     */
    async updateTodoByIdx(idx, updateDto) {
        await this.todoRepository.updateByIdx(idx, {
            title: updateDto.title,
            contents: updateDto.contents,
        });
    }

    /**
     * Delete todo by idx
     *
     * @param {number} idx
     * @returns {Promise<void>}
     */
    async deleteTodoByIdx(idx) {
        await this.todoRepository.deleteByIdx(idx);
    }
};
