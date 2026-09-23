import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel.js';
import { sendSuccess, sendSuccessWithPagination, sendError } from '../utils/response.js';
import { CreateTodoDTO, UpdateTodoDTO, TodoResponse } from '../types/index.js';

// GET /api/todos - Ambil semua todo dengan pagination
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    sendError(res, 401, 'Unauthorized');
    return;
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;
    const offset = (page - 1) * perPage;

    const rawTodos: any = await TodoModel.getByUserId(userId, perPage, offset);
    const totalData = await TodoModel.countByUserId(userId);
    const totalPages = Math.ceil(totalData / perPage);

    // Transformasi field nama database (is_completed -> completed)
    const todos: TodoResponse[] = rawTodos.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      task: item.task,
      completed: Boolean(item.is_completed),
    }));

    // UBAH 'Berhasil mengambil data todo' MENJADI 'Berhasil!'
    sendSuccessWithPagination(res, 200, 'Berhasil!', todos, {
      page,
      perPage,
      totalData,
      totalPages,
    });
  } catch (error) {
    sendError(res, 500, 'Gagal mengambil data.');
  }
};

// GET /api/todos/:id - Ambil satu todo berdasarkan ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    sendError(res, 401, 'Unauthorized');
    return;
  }

  try {
    const todo: any = await TodoModel.getById(Number(id), userId);

    if (!todo) {
      sendError(res, 404, 'Tugas tidak ditemukan!');
      return;
    }

    const responseData: TodoResponse = {
      id: todo.id,
      userId: todo.user_id,
      task: todo.task,
      completed: Boolean(todo.is_completed),
    };

    sendSuccess(res, 200, 'Berhasil!', responseData);
  } catch (error) {
    sendError(res, 500, 'Gagal mengambil data.');
  }
};

// POST /api/todos - Tambah todo baru
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const { task }: CreateTodoDTO = req.body;
  const userId = req.user?.id;

  if (!userId) {
    sendError(res, 401, 'Unauthorized');
    return;
  }

  try {
    const newId = await TodoModel.create(userId, task);
    
    const newTodo: TodoResponse = {
      id: newId,
      userId,
      task,
      completed: false,
    };

    sendSuccess(res, 201, 'Tugas berhasil ditambahkan!', newTodo);
  } catch (error) {
    sendError(res, 500, 'Gagal menambahkan tugas.');
  }
};

// PUT /api/todos/:id - Update todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { task, completed, is_completed }: any = req.body;
  const userId = req.user?.id;

  if (!userId) {
    sendError(res, 401, 'Unauthorized');
    return;
  }

  const isCompletedValue = completed !== undefined ? completed : is_completed;

  try {
    const affectedRows = await TodoModel.update(
      Number(id),
      task,
      isCompletedValue,
      userId
    );

    if (affectedRows === 0) {
      sendError(res, 404, 'Tugas tidak ditemukan!');
      return;
    }

    sendSuccess(res, 200, 'Tugas berhasil diperbarui!');
  } catch (error) {
    sendError(res, 500, 'Gagal memperbarui tugas.');
  }
};

// DELETE /api/todos/:id - Hapus todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    sendError(res, 401, 'Unauthorized');
    return;
  }

  try {
    const affectedRows = await TodoModel.delete(Number(id), userId);

    if (affectedRows === 0) {
      sendError(res, 404, 'Tugas tidak ditemukan!');
      return;
    }

    sendSuccess(res, 200, 'Tugas berhasil dihapus!');
  } catch (error) {
    sendError(res, 500, 'Gagal menghapus tugas.');
  }
};