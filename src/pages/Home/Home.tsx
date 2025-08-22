import React, {useEffect, useState} from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import { useAppStore, Task } from "../../store/appStore";

export default function Home() {
    const {loadTasks, addTask, tasks, setTasks} = useAppStore();
    const [showForm, setShowForm] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    useEffect(() => {
        handleReload();
    }, []);

    const handleReload = async () => {
        await loadTasks();
        setLastSync(new Date());
    };

    const handleAddTask = async (taskData:Omit<Task, 'id' | 'created_at'>) => {
        await addTask(taskData);
        await handleReload();
        setShowForm(false);
    }

    const handleClearAll = () => {
        setTasks([]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Task Manager</Text>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.syncText}>
                    Last sync: {lastSync?.toLocaleString() ?? "Never"}
                </Text>

                <TouchableOpacity style={styles.reloadBtn} onPress={handleReload}>
                    <Text style={styles.reloadText}>Reload</Text>
                </TouchableOpacity>
            </View>


            <TaskList />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
                    <Text style={styles.addText}>+ Add Task</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            {showForm && (
                <TaskForm 
                    onSave={handleAddTask}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 30,
    },
    mainContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingRight: 10,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    reloadBtn: {
        backgroundColor: "#000",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    reloadText: {
        color: "#fff",
        fontWeight: "600",
    },
    syncText: {
        paddingHorizontal: 16,
        color: "#666",
        marginBottom: 8,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 30,
    },
    addBtn: {
        flex: 1,
        backgroundColor: "#000",
        padding: 14,
        borderRadius: 12,
        marginRight: 8,
        alignItems: "center",
    },
    clearBtn: {
        flex: 1,
        backgroundColor: "#d9534f",
        padding: 14,
        borderRadius: 12,
        marginLeft: 8,
        alignItems: "center",
    },
    addText: {
        color: "#fff",
        fontWeight: "600",
    },
    clearText: {
        color: "#fff",
        fontWeight: "600",
    },
});