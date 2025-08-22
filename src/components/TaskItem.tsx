import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { TaskStatus, Task, useAppStore } from "../store/appStore";

type Props = {
    task: Task;
    onPress?: () => void;
};

export default function TaskItem({task, onPress}: Props) {
    const {setStatus, deleteTask} = useAppStore();

    const toggleCompleted = async () => {
        if (task.completed) {
            await setStatus(task.id, 'todo');
        }else{
            await setStatus(task.id, 'done');
        }
    };

    const handleDelete = async () => {
        await deleteTask(task.id);
    };

    const renderBadge = (status: TaskStatus) => {
        let color = "#999";
        if (status === 'todo') color = "#f39c12";
        if (status === 'doing') color = "#3498db";
        if (status === 'done') color = "#27ae60";

        return (
            <View style={[styles.badge, {backgroundColor: color}]}>
                <Text style={styles.badgeText}>{status.toUpperCase()}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.mainContent} onPress={onPress}>
                <Switch value={task.completed} onValueChange={toggleCompleted} />

                <View style={styles.content}>
                    <Text style={[styles.title, task.completed && styles.completed]}>{task.title}
                    </Text>
                    {task.description ? (
                        <Text style={styles.description}>{task.description}</Text>
                    ): null}
                </View>

                {renderBadge(task.status)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create ({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
        justifyContent: "space-between",
    },
    mainContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    content: {
        flex: 1,
        marginLeft: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    completed: {
        textDecorationLine: "line-through",
        color: "#aaa",
    },
    description: {
        fontSize: 14,
        color: "#555",
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
    deleteButton: {
        marginLeft: 8,
        backgroundColor: "#e74c3c",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "bold",
    },
});