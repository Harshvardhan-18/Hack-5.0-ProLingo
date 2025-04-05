import { BooleanInput, Edit, NumberInput, ReferenceInput, required, SimpleForm, TextInput } from "react-admin"


export const ChallengeOptionEdit = () => {
    return (
       <Edit>
            <SimpleForm>
                <TextInput source="text" validate={[required()]}  label="Text" />
                <BooleanInput source="correct" label="Correct option" />
                <ReferenceInput source="lessonId" reference="lessons" />
                <NumberInput source="order" validate={[required()]} label="Order"/>
                <TextInput source="imageSrc" validate={[required()]}  label="Image URL" />
                <TextInput source="audioSrc" validate={[required()]}  label="Audio URL" />

            </SimpleForm>
        </Edit>
    )
}