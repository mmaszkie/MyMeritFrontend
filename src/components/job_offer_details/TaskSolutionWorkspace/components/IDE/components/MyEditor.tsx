import React from "react";
import Editor from '@monaco-editor/react';
import MyFile from "../../../../../../models/MyFile";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import {getLanguageFromFileName} from "../../../utils/fileUtils";

interface MyEditorProps{
    files: MyFile[],
    currentFileIndex: number,
    setFiles: (files: MyFile[]) => void;
}

const MyEditor: React.FC<MyEditorProps> = ({files, currentFileIndex, setFiles}) => {
    const currentFile = files[currentFileIndex];

    const handleEditorChange = (value: string) => {
        const updatedFiles = [...files];
        updatedFiles[currentFileIndex].contentBase64 = btoa(value);
        setFiles(updatedFiles);
    }

    if(currentFile.type === "text/plain"){
        let editorValue = "";
        try {
            editorValue = atob(currentFile.contentBase64);
        } catch (error) {
            console.error("Error decoding base64 string:", error);
        }

        return (
            <Editor
                theme="customTheme"
                height="100%"
                path={currentFile.name}
                language={getLanguageFromFileName(currentFile.name)}
                value={editorValue}
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                }}
            />
        );
    }else{
        return (
            <DocViewer
                documents={[{
                    uri: ("data:" + currentFile.type + ";base64," + currentFile.contentBase64),
                    fileName: currentFile.name,
                }]}

                config={{
                    header: {
                        disableHeader: true,
                    },

                }}

                theme= {{
                    primary: "#8c8f9f",
                    secondary: "#9f5afd",
                    tertiary: "#3a3b46",
                    textPrimary: "#ffffff",
                    textSecondary: "#6ee7b7",
                    textTertiary: "#fff",
                    disableThemeScrollbar: false,
                }}

                style={{ maxHeight: "45vh" }}
                pluginRenderers={DocViewerRenderers}
            />
        )
    }

};

export default MyEditor;