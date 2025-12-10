import { useState, useEffect, useCallback } from "react";
import { getAllUsers, updateUserStatus, deleteUser } from "../api/userService";
import type { User } from "@models/user";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = useCallback(async () => {
    try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
    } catch (e) {
        setError("Error al cargar usuarios.");
    } finally {
        setLoading(false);
    }   
    }, []);

    const toggleActive = async (id: number, active: boolean) => {
    await updateUserStatus(id, active);
    loadUsers();
    };

    const removeUser = async (id: number) => {
        await deleteUser(id);
        loadUsers();
    };

    useEffect(() => { loadUsers(); }, [loadUsers]);

    return { users, loading, error, loadUsers, toggleActive, removeUser };
}
