let container = document.getElementById("array");
let explain = document.getElementById("explain");

let arr = [];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq) {

    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.value = freq;
    osc.start();

    gain.gain.exponentialRampToValueAtTime(
        0.00001,
        audioCtx.currentTime + 0.15
    );

}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function generateArray() {

    container.innerHTML = "";
    arr = [];

    for (let i = 0; i < 25; i++) {

        let value = Math.floor(Math.random() * 200) + 20;

        arr.push(value);

        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = value + "px";

        container.appendChild(bar);

    }

    explain.innerText = "Random array generated.";

    drawComplexityGraph();
}

generateArray();

function updateBars() {

    let bars = document.getElementsByClassName("bar");

    for (let i = 0; i < arr.length; i++) {
        bars[i].style.height = arr[i] + "px";
    }

}

async function startSort() {

    let algo = document.getElementById("algorithm").value;

    if (algo === "merge") {

        explain.innerText = "Merge Sort: divide the array into smaller parts.";
        await mergeSort(0, arr.length - 1);

    }

    if (algo === "bubble") {

        explain.innerText = "Bubble Sort: repeatedly compare adjacent elements.";
        await bubbleSort();

    }

    if (algo === "quick") {

        explain.innerText = "Quick Sort: choose a pivot and partition.";
        await quickSort(0, arr.length - 1);

    }

    explain.innerText = "Sorting Completed.";

}






/* BUBBLE SORT */

async function bubbleSort() {

    for (let i = 0; i < arr.length; i++) {

        for (let j = 0; j < arr.length - i - 1; j++) {

            explain.innerText = `Comparing ${arr[j]} and ${arr[j + 1]}`;

            playSound(arr[j] * 5);

            if (arr[j] > arr[j + 1]) {

                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                updateBars();
                await sleep(80);

            }

        }

    }

}




/* MERGE SORT */

async function mergeSort(l, r) {

    if (l >= r) return;

    let m = Math.floor((l + r) / 2);

    explain.innerText = `Divide array into [${l}-${m}] and [${m + 1}-${r}]`;

    await mergeSort(l, m);
    await mergeSort(m + 1, r);

    await merge(l, m, r);

}

async function merge(l, m, r) {

    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {

        explain.innerText = `Merging ${left[i]} and ${right[j]}`;

        playSound((left[i] + right[j]) * 4);

        if (left[i] <= right[j]) {

            arr[k] = left[i];
            i++;

        }
        else {

            arr[k] = right[j];
            j++;

        }

        k++;

        updateBars();
        await sleep(100);

    }

    while (i < left.length) {

        arr[k] = left[i];
        i++;
        k++;
        updateBars();
        await sleep(80);

    }

    while (j < right.length) {

        arr[k] = right[j];
        j++;
        k++;
        updateBars();
        await sleep(80);

    }

}




/* QUICK SORT */

async function quickSort(low, high) {

    if (low < high) {

        let pi = await partition(low, high);

        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);

    }

}

async function partition(low, high) {

    let pivot = arr[high];

    explain.innerText = `Pivot chosen: ${pivot}`;

    let i = low - 1;

    for (let j = low; j < high; j++) {

        playSound(arr[j] * 4);

        if (arr[j] < pivot) {

            i++;

            [arr[i], arr[j]] = [arr[j], arr[i]];

            updateBars();
            await sleep(90);

        }

    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    updateBars();

    return i + 1;

}




/* COMPLEXITY GRAPH */

function drawComplexityGraph() {

    let canvas = document.getElementById("complexityChart");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 400, 250);

    let values = [40, 200, 120];
    let labels = ["Bubble", "Merge", "Quick"];

    for (let i = 0; i < values.length; i++) {

        ctx.fillRect(i * 100 + 60, 250 - values[i], 40, values[i]);

        ctx.fillText(labels[i], i * 100 + 60, 240);

    }

    ctx.fillText("Higher bar = slower complexity", 110, 20);

}