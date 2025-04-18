import { Datagrid, List, NumberField, ReferenceField, TextField } from "react-admin"


export const LessonList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id"/>
                <TextField source="title"/>
                <ReferenceField source="courseId" reference="courses" />
                <NumberField source="order"/>
            </Datagrid>
        </List>
    )
}