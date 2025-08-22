import { Picker } from "@react-native-picker/picker";
import { TaskStatus, Task, useAppStore } from "../store/appStore";
import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

type Props = {
    task?: Task;
    onClose?: () => void;
    onSave: (taskData: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
    onCancel: () => void;
};

export default function TaskForm({task, onClose, onCancel, onSave}: Props) {
    const {tasks, setTasks} = useAppStore();

    
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [status, setStatus] = useState(task?.status || '');

    const statusOptions: {label: string; value: TaskStatus} [] = [
        {label: 'To Do', value: 'todo'},
        {label: 'Doing', value: 'doing'},
        {label: 'Done', value: 'done'},
    ];

    const handleSave = async () => {

        await onSave({
            title,
            description,
            status,
            completed,
        });

        if (!title.trim()) return;

        if (task) {
            const updatedTasks = tasks.map((t) => t.id === task.id ? { ...t, title, description, status: status as TaskStatus} : t);
            setTasks(updatedTasks);
        }else{
            const newTask: Task = {
                id: Date.now(),
                title,
                description,
                status: status as TaskStatus,
                completed: status === 'done',
            };
            setTasks([...tasks, newTask]);
        }
        if (onClose) onClose();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título</Text>
            <TextInput value={title} onChangeText={setTitle} style={styles.input} />

            <Text style={styles.label}>Descripción</Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.input} />

            <Text style={styles.label}>Estado</Text>
            <Picker selectedValue={status} onValueChange={setStatus}>
                {statusOptions.map(o => (
                    <Picker.Item key={o.value} label={o.label} value={o.value} />
                ))}
            </Picker>

            <Button title="Guardar" onPress={handleSave} />
            <Button title="Cancel" onPress={onCancel} />
        </View>
    );
};

const styles = StyleSheet.create ({
    container: {
        padding: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginTop: 4,
    },
});