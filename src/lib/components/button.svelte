<script lang="ts">
    let {
        text = "Button",
        onClick,
        white = false
    } = $props();
</script>

<button onclick = {onClick}
        class={`${white ? "bg-neutral-900 text-neutral-100" : "bg-neutral-100 text-neutral-900"} rounded-full px-16 py-2 text-sm font-bold cursor-pointer`}>
    {text}
</button>
