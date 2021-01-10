<template>
    <div class="note">
        <h1>
            <input
                type="text"
                placeholder="Enter a title"
                v-model="title"
                :readonly="!editMode"
                maxlength="30"
            />
            <div class="float-right">
                <button
                    v-if="editMode"
                    class="btn btn-danger mr-3"
                    data-toggle="modal"
                    data-target="#deleteModal"
                >
                    Delete
                </button>
                <button
                    v-if="editMode"
                    class="btn btn-warning mr-3"
                    v-on:click="cancelEdit"
                >
                    Cancel
                </button>
                <button
                    v-if="editMode"
                    class="btn btn-success"
                    v-on:click="save()"
                >
                    Save
                </button>
                <button
                    v-if="!editMode"
                    class="btn btn-primary"
                    v-on:click="beginEdit()"
                >
                    Edit
                </button>
            </div>
            <div class="clearfix"></div>
        </h1>
        <hr />
        <editor-menu-bar
            :editor="editor"
            v-slot="{ commands, isActive }"
            class="mb-3"
            v-if="editMode"
        >
            <div class="menubar">
                <button
                    class="menu-btn"
                    :class="{ active: isActive.bold() }"
                    @click="commands.bold"
                    title="Bold"
                >
                    <BoldIcon />
                </button>
                <button
                    class="menu-btn"
                    :class="{ active: isActive.italic() }"
                    @click="commands.italic"
                    title="Italic"
                >
                    <ItalicIcon />
                </button>
                <button
                    class="menu-btn"
                    :class="{ active: isActive.italic() }"
                    @click="commands.underline"
                    title="Underline"
                >
                    <UnderlineIcon />
                </button>
                <span class="separator" />
                <button
                    class="menu-btn"
                    :class="{ active: isActive.paragraph() }"
                    @click="commands.paragraph"
                    title="Paragraph"
                >
                    <TypeIcon />
                </button>
                <button
                    class="menu-btn"
                    :class="{ active: isActive.code_block() }"
                    @click="commands.code_block"
                    title="Code"
                >
                    <CodeIcon />
                </button>
                <button
                    class="menu-btn"
                    :class="{ active: isActive.bullet_list() }"
                    @click="commands.bullet_list"
                    title="List"
                >
                    <ListIcon />
                </button>
                <button
                    class="menu-btn"
                    @click="commands.horizontal_rule"
                    title="Horizontal line"
                >
                    <MinusIcon />
                </button>
                <span class="separator" />
                <button class="menu-btn" @click="commands.undo" title="Undo">
                    <CornerUpLeftIcon />
                </button>
                <button class="menu-btn" @click="commands.redo" title="Redo">
                    <CornerUpRightIcon />
                </button>
            </div>
        </editor-menu-bar>
        <editor-content :editor="editor" class="editor mb-5" />

        <div id="deleteModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Delete note</h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            Really delete note <strong>{{ title }}</strong
                            >?
                        </p>
                        <p>
                            <strong class="text-danger"
                                >This cannot be undone.</strong
                            >
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            data-dismiss="modal"
                            v-on:click="deleteNote()"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '../services/api';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    Placeholder
} from 'tiptap-extensions';

import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    CodeIcon,
    MinusIcon,
    CornerUpLeftIcon,
    CornerUpRightIcon,
    ListIcon,
    TypeIcon
} from 'vue-feather-icons';

var oldContent = '';
var oldTitle = '';

export default {
    components: {
        EditorContent,
        EditorMenuBar,
        BoldIcon,
        ItalicIcon,
        UnderlineIcon,
        CodeIcon,
        MinusIcon,
        CornerUpLeftIcon,
        CornerUpRightIcon,
        ListIcon,
        TypeIcon
    },
    data() {
        return {
            title: '',
            editor: new Editor({
                extensions: [
                    new Blockquote(),
                    new BulletList(),
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading({ levels: [1, 2, 3, 4] }),
                    new HorizontalRule(),
                    new ListItem(),
                    new OrderedList(),
                    new Link(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Strike(),
                    new Underline(),
                    new History(),
                    new Placeholder({
                        emptyEditorClass: 'is-editor-empty',
                        emptyNodeClass: 'is-empty',
                        emptyNodeText: 'Write something …',
                        showOnlyWhenEditable: true,
                        showOnlyCurrent: true
                    })
                ],
                content: '',
                editable: false
            }),
            editMode: false,
            saving: false
        };
    },
    beforeDestroy() {
        this.editor.destroy();
    },
    async mounted() {
        let data = (await Api.Notes.getById(this.$route.params.noteId)).data;
        this.title = data.title;
        this.editor.setContent(data.content);

        if (data.content.trim().length == 0) {
            this.beginEdit();
        }
    },
    methods: {
        beginEdit() {
            oldContent = this.editor.getHTML();
            oldTitle = this.title;
            this.editMode = true;
        },
        async save() {
            this.saving = true;
            let saveContent = this.editor.getHTML();
            await Api.Notes.edit(
                this.$route.params.noteId,
                this.title,
                saveContent
            );
            this.saving = false;
            this.editMode = false;
            this.clearSelection();
        },
        cancelEdit() {
            this.editor.setContent(oldContent);
            this.title = oldTitle;
            this.editMode = false;
            this.clearSelection();
        },
        clearSelection() {
            if (window.getSelection) {
                if (window.getSelection().empty) {
                    // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {
                    // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {
                // IE?
                document.selection.empty();
            }
        },
        async deleteNote() {
            await Api.Notes.delete(this.$route.params.noteId);
            this.$router.push('/note/select');
        }
    },
    watch: {
        editMode() {
            this.editor.setOptions({
                editable: this.editMode
            });
        }
    }
};
</script>

<style scoped>
.menu-btn {
    background: #fff;
    border: 0;
    display: inline-block;
    margin: 0 5px;
    outline: 0;
    border-radius: 4px;
    transition-duration: 0.3s;
    width: 32px;
    height: 32px;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
.menu-btn:hover {
    background: #efefef;
    transition-duration: 0.3s;
}
.menu-btn.active {
    background: #ddd;
    transition-duration: 0.3s;
}
.feather {
    width: 18px;
    height: 18px;
    vertical-align: top;
    margin-top: 1.5px;
    color: #555;
}
.separator {
    width: 1px;
    height: 25px;
    display: inline-block;
    margin: 0px 8px;
    background: rgba(0, 0, 0, 0.1);
    vertical-align: middle;
}
input[type='text'] {
    background: transparent;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
}
</style>

<style>
.editor p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
}
.ProseMirror {
    background-color: white;
    margin: 5px;
    border-radius: 4px;
    padding: 15px;
    min-height: 250px;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    line-height: 1.5;
}
.ProseMirror[contenteditable='false'] {
    min-height: 0;
}
.ProseMirror>:first-child {
    margin-top: 0!important;
}
.ProseMirror > hr {
    margin-top: 25px;
    margin-bottom: 25px;
    border-color: rgb(234, 236, 239);
}
.ProseMirror > h1 {
    font-size: 2em;

    padding-bottom: .3em;
    margin-top: 24px;
    margin-bottom: 16px;
    border-bottom: 1px solid rgb(234, 236, 239);
}
.ProseMirror > h2 {
    font-size: 1.5em;
}
.ProseMirror > h3 {
    font-size: 1.25em;
}
.ProseMirror > h4 {
    font-size: 1.125em;
}

[contenteditable] {
    outline: 0 !important;
}
[contenteditable][placeholder]:empty:before {
    content: attr(placeholder);
    position: absolute;
    color: gray;
    background: transparent;
    cursor: text;
}

pre {
    background: rgb(246, 248, 250);
    color: rgb(36, 41, 46);
    padding: 15px;
    border-radius: 3px;
}

:not(pre) > code {
    background: rgb(246, 248, 250);
    color: rgb(36, 41, 46);
    border-radius: 3px;
    padding: 3px 6px;
}

blockquote {
    border-left: 3px solid #ddd;
    padding-left: 15px;
}
</style>
