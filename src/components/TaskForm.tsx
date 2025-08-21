import { Picker } from "@react-native-picker/picker";
import { TaskStatus } from "../store/appStore";
import { useState } from "react";

const [status, setStatus] = useState<TaskStatus>('todo');
const statusOptions: {label:string, value:TaskStatus}[] = [
    {label: 'To Do', value: 'todo'},
    {label: 'Doing', value: 'doing'},
    {label: 'Done', value: 'done'},
];

<Picker selectedValue={status} onValueChange={(v) => setStatus(v)}>
    {statusOptions.map(o => <Picker.Item key={o.value} label={o.value} value={o.value} />)}
</Picker>