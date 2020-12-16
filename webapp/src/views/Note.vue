<template>
    <div class="note">
        <h1 contenteditable="true" placeholder="Enter a title"></h1>
        <hr />
        <div
            contenteditable="true"
            placeholder="Type your Note here (Markdown supported)"
        ></div>
    </div>
</template>

<style scoped>
h1,
div {
    outline: 0;
}
[contenteditable][placeholder]:empty:before {
    content: attr(placeholder);
    position: absolute;
    color: gray;
    background: transparent;
    cursor: text;
}
</style>
