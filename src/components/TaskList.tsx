import React from "react";
import { SectionList, Text, StyleSheet, View } from "react-native";
import { useAppStore, Task } from "../store/appStore";
import TaskItem from "./TaskItem";

type Props = {
    onEditTask?: (task: Task) => void;
};

export default function TaskList({onEditTask}: Props) {
    const tasks = useAppStore((s) => s.tasks);

    const sections = [
        {title: 'To Do', data: tasks.filter((t) => t.status === 'todo') },
        {title: 'Doing', data: tasks.filter((t) => t.status === 'doing') },
        {title: 'Done', data: tasks.filter((t) => t.status === 'done') },
    ];

    return (
        <SectionList 
            sections={sections}
            keyExtractor={(item) => String(item.id)}
            renderItem={({item}) => <TaskItem task={item} onEditTask={onEditTask} />}
            renderSectionHeader={({section}) => (
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{section.title}</Text>
                </View>
            )}
            contentContainerStyle={{paddingBottom: 24}}
        />
    );
};

const styles = StyleSheet.create( {
    headerContainer: {
        backgroundColor: "#f0f0f0",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
});