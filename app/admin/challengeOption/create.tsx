import { BooleanInput, Create, NumberInput, ReferenceInput, required, SimpleForm, TextInput } from "react-admin"


export const ChallengeOptionCreate = () => {
    return (
       <Create>
            <SimpleForm>
                <TextInput source="text" validate={[required()]}  label="Text" />
                <BooleanInput source="correct" label="Correct option" />
                <ReferenceInput source="lessonId" reference="lessons" />
                <NumberInput source="order" validate={[required()]} label="Order"/>
                <ReferenceInput source="challengeId" reference="challenges" />
                <TextInput source="imageSrc"  label="Image URL" />
                <TextInput source="audioSrc"  label="Audio URL" />

            </SimpleForm>
        </Create>
    )
}