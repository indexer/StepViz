import type { Algorithm } from "../types/algorithm";

export const sortingAlgorithms: Algorithm[] = [
  {
    id: "SRT_001",
    name: "Quick Sort",
    category: "Sorting",
    difficulty: "Medium",
    timeComplexity: "O(n log n) average, O(n²) worst",
    spaceComplexity: "O(log n)",
    description: "A divide-and-conquer algorithm that selects a pivot element and partitions the array around it, recursively sorting the subarrays.",
    longDescription: "Quick Sort is one of the most efficient sorting algorithms in practice. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. Despite having O(n²) worst-case time complexity, it performs exceptionally well on average with O(n log n) complexity. The choice of pivot and partitioning scheme greatly affects performance.",
    icon: "reorder",
    complexityScore: 0.65,
    tags: ["divide-and-conquer", "in-place", "unstable", "recursive", "comparison-based"],
    leetcodeProblems: [
      "Sort an Array",
      "Kth Largest Element in an Array",
      "Sort Colors"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left: number[] = [];
  const middle: number[] = [];
  const right: number[] = [];

  for (const num of arr) {
    if (num < pivot) left.push(num);
    else if (num > pivot) right.push(num);
    else middle.push(num);
  }

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// In-place version
function quickSortInPlace(arr: number[], low = 0, high = arr.length - 1): void {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSortInPlace(arr, low, pi - 1);
    quickSortInPlace(arr, pi + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Function Signature and Base Case",
            description: "Define quickSort that takes an array of numbers and returns a sorted array. Check if the array has 0 or 1 elements - if so, it's already sorted and we return it immediately. This is the recursion termination condition.",
            variables: { "arr": "[5, 3, 8, 1]", "arr.length": "4" }
          },
          {
            lines: [4],
            title: "Select Pivot Element",
            description: "Choose the middle element as the pivot. This helps avoid worst-case performance on already-sorted arrays. The pivot is the value around which we'll partition the array.",
            variables: { "pivot": "8", "arr[Math.floor(arr.length / 2)]": "8" }
          },
          {
            lines: [5, 6, 7],
            title: "Initialize Partition Arrays",
            description: "Create three empty arrays: 'left' for elements smaller than pivot, 'middle' for elements equal to pivot, and 'right' for elements greater than pivot. This is the partitioning step that divides the problem.",
            variables: { "left": "[]", "middle": "[]", "right": "[]" }
          },
          {
            lines: [9, 10, 11, 12],
            title: "Partition Elements",
            description: "Iterate through each element in the array and distribute it to the appropriate partition based on comparison with the pivot. Elements less than pivot go left, greater go right, and equal go to middle. This separates the array into three groups.",
            variables: { "left": "[5, 3, 1]", "middle": "[8]", "right": "[]" }
          },
          {
            lines: [15],
            title: "Recursive Sort and Combine",
            description: "Recursively sort the left and right subarrays, then combine them with the middle array using the spread operator. The middle array doesn't need sorting since all elements are equal. This is where the divide-and-conquer strategy comes together.",
            variables: { "quickSort(left)": "[1, 3, 5]", "middle": "[8]", "quickSort(right)": "[]" }
          },
          {
            lines: [18, 19, 20, 21, 22, 23],
            title: "In-Place Version Setup",
            description: "The in-place version modifies the original array instead of creating new arrays. It uses low and high pointers to track the current subarray being sorted, avoiding the extra space needed in the simple version.",
            variables: { "low": "0", "high": "3" }
          },
          {
            lines: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
            title: "Partition Function for In-Place",
            description: "The partition function rearranges elements so that all elements smaller than the pivot are on the left and all larger elements are on the right. It uses the last element as pivot and maintains an index 'i' to track the boundary. Elements are swapped in-place to achieve partitioning without extra arrays.",
            variables: { "pivot": "arr[high]", "i": "low - 1" }
          }
        ]
      },
      {
        language: "python",
        code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

# In-place version
def quick_sort_inplace(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1

    if low < high:
        pi = partition(arr, low, high)
        quick_sort_inplace(arr, low, pi - 1)
        quick_sort_inplace(arr, pi + 1, high)

    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Function Definition and Base Case",
            description: "Define quick_sort that takes an array. Check if the array has 0 or 1 elements - if so, it's already sorted and we return it immediately. This is the recursion termination condition that prevents infinite recursion.",
            variables: { "arr": "[5, 3, 8, 1]", "len(arr)": "4" }
          },
          {
            lines: [5],
            title: "Select Pivot Element",
            description: "Choose the middle element as the pivot using integer division. This helps avoid worst-case performance on already-sorted arrays. The pivot is the value around which we'll partition the array into three groups.",
            variables: { "pivot": "8", "arr[len(arr) // 2]": "8" }
          },
          {
            lines: [6, 7, 8],
            title: "Partition into Three Lists",
            description: "Use list comprehensions to partition the array into three lists: 'left' contains all elements less than pivot, 'middle' contains elements equal to pivot, and 'right' contains elements greater than pivot. This is the divide step of divide-and-conquer.",
            variables: { "left": "[5, 3, 1]", "middle": "[8]", "right": "[]" }
          },
          {
            lines: [10],
            title: "Recursive Sort and Combine",
            description: "Recursively sort the left and right sublists, then concatenate them with the middle list using the + operator. The middle list doesn't need sorting since all elements are equal. This is the conquer step where sorted pieces are combined.",
            variables: { "quick_sort(left)": "[1, 3, 5]", "result": "[1, 3, 5, 8]" }
          },
          {
            lines: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
            title: "In-Place Version",
            description: "The in-place version modifies the original array instead of creating new lists. It uses low and high indices to track the current subarray being sorted. The None check for high parameter allows calling the function without specifying bounds initially. This version saves space but is more complex.",
            variables: { "low": "0", "high": "len(arr) - 1", "pi": "partition index" }
          },
          {
            lines: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
            title: "Partition Function",
            description: "The partition function rearranges elements so that all elements smaller than the pivot are on the left and all larger elements are on the right. It uses the last element as pivot and maintains an index i to track the boundary. Elements are swapped in-place using Python's tuple unpacking syntax. Returns the final pivot position.",
            variables: { "pivot": "arr[high]", "i": "low - 1" }
          }
        ]
      }
    ],
    keyInsights: [
      "Pivot selection strategy significantly impacts performance - randomized pivot helps avoid worst case",
      "Cache-friendly due to good locality of reference during partitioning",
      "Unstable sort - may not preserve relative order of equal elements",
      "Performs well on modern architectures due to small code footprint and sequential access patterns"
    ],
    whenToUse: [
      "When average-case performance is more important than worst-case guarantees",
      "When working with large datasets that fit in memory and need in-place sorting",
      "When you need a fast general-purpose sorting algorithm"
    ]
  },
  {
    id: "SRT_002",
    name: "Merge Sort",
    category: "Sorting",
    difficulty: "Medium",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "A stable divide-and-conquer algorithm that recursively divides the array into halves, sorts them, and merges the sorted halves.",
    longDescription: "Merge Sort is a reliable and predictable sorting algorithm that guarantees O(n log n) time complexity in all cases. It works by recursively dividing the array into two halves until each sub-array contains a single element, then merging these sub-arrays in sorted order. The merge operation compares elements from both sub-arrays and combines them into a single sorted array. While it requires additional space proportional to the input size, its stable nature and consistent performance make it ideal for scenarios requiring predictable behavior.",
    icon: "merge",
    complexityScore: 0.6,
    tags: ["divide-and-conquer", "stable", "recursive", "comparison-based", "predictable"],
    leetcodeProblems: [
      "Sort an Array",
      "Sort List",
      "Count of Smaller Numbers After Self"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Base Case Check",
            description: "If the array has 1 or fewer elements, it's already sorted and can be returned immediately. This is the termination condition for the recursive divide-and-conquer approach.",
            variables: { "arr": "[64, 34, 25, 12]", "arr.length": "4" }
          },
          {
            lines: [4],
            title: "Find Middle Point",
            description: "Calculate the middle index to divide the array into two roughly equal halves. This is the 'divide' step of the divide-and-conquer strategy.",
            variables: { "mid": "2", "arr.length": "4" }
          },
          {
            lines: [5, 6],
            title: "Recursive Division",
            description: "Recursively sort the left half (from start to mid) and right half (from mid to end) of the array. Each recursive call further divides the array until we reach single-element arrays, which are inherently sorted.",
            variables: { "arr.slice(0, mid)": "[64, 34]", "arr.slice(mid)": "[25, 12]" }
          },
          {
            lines: [8],
            title: "Merge Sorted Halves",
            description: "Combine the two sorted subarrays using the merge function. This is the 'conquer' step where sorted pieces are merged back together in order.",
            variables: { "left": "[34, 64]", "right": "[12, 25]" }
          },
          {
            lines: [11, 12, 13],
            title: "Initialize Merge",
            description: "Create an empty result array and initialize two pointers (i and j) to track positions in the left and right arrays. These pointers will move through each array as we compare and merge elements.",
            variables: { "result": "[]", "i": "0", "j": "0" }
          },
          {
            lines: [15, 16, 17, 18, 19, 20, 21, 22],
            title: "Compare and Merge",
            description: "While both arrays have elements remaining, compare the current elements from left and right arrays. Add the smaller element to the result and advance the corresponding pointer. The <= comparison ensures stability by preferring the left array when elements are equal.",
            variables: { "left[i]": "34", "right[j]": "12", "result": "[12, 25, 34]" }
          },
          {
            lines: [24, 25, 26, 27, 28, 29, 30, 31, 32],
            title: "Append Remaining Elements",
            description: "After one array is exhausted, append all remaining elements from the other array to the result. Since both input arrays are already sorted, the remaining elements can be added directly without further comparison.",
            variables: { "result": "[12, 25, 34, 64]" }
          }
        ]
      },
      {
        language: "python",
        code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])

    return result

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
sorted_arr = merge_sort(arr)
print(sorted_arr)  # [11, 12, 22, 25, 34, 64, 90]`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Base Case Check",
            description: "If the array has 1 or fewer elements, it's already sorted and can be returned immediately. This is the termination condition for the recursive divide-and-conquer approach, preventing infinite recursion.",
            variables: { "arr": "[64, 34, 25, 12]", "len(arr)": "4" }
          },
          {
            lines: [5],
            title: "Find Middle Point",
            description: "Calculate the middle index using integer division to divide the array into two roughly equal halves. This is the 'divide' step of the divide-and-conquer strategy.",
            variables: { "mid": "2", "len(arr)": "4" }
          },
          {
            lines: [6, 7],
            title: "Recursive Division",
            description: "Recursively sort the left half (from start to mid) and right half (from mid to end) of the array using Python's slice notation. Each recursive call further divides the array until we reach single-element arrays, which are inherently sorted.",
            variables: { "arr[:mid]": "[64, 34]", "arr[mid:]": "[25, 12]" }
          },
          {
            lines: [9],
            title: "Merge Sorted Halves",
            description: "Combine the two sorted subarrays using the merge function. This is the 'conquer' step where sorted pieces are merged back together in order to produce the final sorted array.",
            variables: { "left": "[34, 64]", "right": "[12, 25]" }
          },
          {
            lines: [11, 12, 13],
            title: "Initialize Merge Process",
            description: "Create an empty result list and initialize two index pointers (i and j) to 0. These pointers track our current position in the left and right arrays as we compare and merge elements.",
            variables: { "result": "[]", "i": "0", "j": "0" }
          },
          {
            lines: [15, 16, 17, 18, 19, 20, 21],
            title: "Compare and Merge Elements",
            description: "While both arrays have elements remaining, compare the current elements from left and right arrays. Append the smaller element to the result and advance the corresponding pointer. The <= comparison ensures stability by preferring the left array when elements are equal.",
            variables: { "left[i]": "34", "right[j]": "12", "result": "[12, 25, 34]" }
          },
          {
            lines: [23, 24],
            title: "Append Remaining Elements",
            description: "After one array is exhausted, append all remaining elements from the other array to the result using extend(). Since both input arrays are already sorted, the remaining elements can be added directly without further comparison.",
            variables: { "result": "[12, 25, 34, 64]" }
          }
        ]
      }
    ],
    keyInsights: [
      "Guaranteed O(n log n) performance in all cases - no worst-case degradation",
      "Stable sort - maintains relative order of equal elements, crucial for multi-key sorting",
      "Well-suited for external sorting of large datasets that don't fit in memory",
      "Parallelizable - different sub-arrays can be sorted independently"
    ],
    whenToUse: [
      "When stable sorting is required (preserving order of equal elements)",
      "When consistent O(n log n) performance is needed regardless of input distribution",
      "For external sorting of large files or datasets"
    ]
  },
  {
    id: "SRT_003",
    name: "Heap Sort",
    category: "Sorting",
    difficulty: "Medium",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "A comparison-based sorting algorithm that uses a binary heap data structure to sort elements in-place with guaranteed O(n log n) time complexity.",
    longDescription: "Heap Sort leverages the heap data structure to efficiently sort an array. It first builds a max heap from the input data, then repeatedly extracts the maximum element from the heap and places it at the end of the sorted portion. The algorithm combines the space efficiency of insertion sort with the time efficiency of merge sort. While it guarantees O(n log n) time complexity and uses only O(1) extra space, it's not stable and generally slower in practice than well-implemented Quick Sort due to poor cache performance.",
    icon: "filter_list",
    complexityScore: 0.7,
    tags: ["comparison-based", "in-place", "unstable", "heap-structure", "guaranteed-performance"],
    leetcodeProblems: [
      "Sort an Array",
      "Kth Largest Element in an Array",
      "Top K Frequent Elements"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function heapSort(arr: number[]): number[] {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize Array Length",
            description: "Store the array length in a variable. This will be used throughout the algorithm to determine heap boundaries and iteration limits.",
            variables: { "arr": "[12, 11, 13, 5, 6, 7]", "n": "6" }
          },
          {
            lines: [4, 5, 6],
            title: "Build Max Heap",
            description: "Build a max heap from the input array by calling heapify on all non-leaf nodes, starting from the last non-leaf node (at index n/2 - 1) and moving backwards to the root. This ensures that the largest element ends up at the root (index 0). We start from the bottom to ensure subtrees are valid heaps before heapifying their parents.",
            variables: { "i": "2", "Math.floor(n / 2) - 1": "2" }
          },
          {
            lines: [8, 9, 10],
            title: "Extract Max and Reduce Heap",
            description: "Repeatedly swap the root (maximum element) with the last element of the heap, then reduce the heap size by 1. After each swap, the maximum element is now in its final sorted position at the end of the array. Call heapify on the reduced heap to restore the max heap property.",
            variables: { "i": "5", "arr[0]": "13 (max)", "arr[i]": "7 (last)" }
          },
          {
            lines: [12],
            title: "Return Sorted Array",
            description: "After all elements have been extracted from the heap and placed in their sorted positions, return the now-sorted array. The array has been sorted in-place in ascending order.",
            variables: { "arr": "[5, 6, 7, 11, 12, 13]" }
          },
          {
            lines: [15, 16, 17, 18],
            title: "Heapify Setup",
            description: "Initialize the heapify process by assuming the largest element is at the current node index 'i'. Calculate the indices of the left child (2*i + 1) and right child (2*i + 2) in the binary heap tree structure stored as an array.",
            variables: { "largest": "i", "left": "2*i + 1", "right": "2*i + 2" }
          },
          {
            lines: [20, 21, 22, 23, 24, 25, 26],
            title: "Find Largest Among Node and Children",
            description: "Compare the current node with its left and right children (if they exist within the heap boundary 'n'). Update 'largest' to point to the index of the maximum value among the node and its children. This identifies which element should be at the parent position in a max heap.",
            variables: { "arr[i]": "11", "arr[left]": "13", "arr[right]": "12", "largest": "left" }
          },
          {
            lines: [28, 29, 30],
            title: "Swap and Recursively Heapify",
            description: "If the largest element is not the current node, swap them to satisfy the max heap property. Then recursively call heapify on the affected subtree to ensure it also maintains the max heap property. This propagates changes down the tree until the entire subtree is a valid max heap.",
            variables: { "arr[i]": "11", "arr[largest]": "13" }
          }
        ]
      },
      {
        language: "python",
        code: `def heap_sort(arr):
    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements from heap one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

    return arr

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

# Example usage
arr = [12, 11, 13, 5, 6, 7]
heap_sort(arr)
print(arr)  # [5, 6, 7, 11, 12, 13]`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize Array Length",
            description: "Store the array length in a variable. This will be used throughout the algorithm to determine heap boundaries and iteration limits for building the heap and extracting elements.",
            variables: { "arr": "[12, 11, 13, 5, 6, 7]", "n": "6" }
          },
          {
            lines: [4, 5, 6],
            title: "Build Max Heap",
            description: "Build a max heap from the input array by calling heapify on all non-leaf nodes, starting from the last non-leaf node (at index n//2 - 1) and moving backwards to the root. The range uses -1 step to iterate backwards. This ensures the largest element ends up at the root.",
            variables: { "i": "2, 1, 0", "n // 2 - 1": "2" }
          },
          {
            lines: [8, 9, 10, 11],
            title: "Extract Max and Rebuild Heap",
            description: "Repeatedly swap the root (maximum element) with the last element of the heap, then reduce the heap size by 1 and call heapify to restore the max heap property. This places the maximum element in its final sorted position at the end of the array. The range iterates from n-1 down to 1.",
            variables: { "i": "5, 4, 3, ...", "arr[0]": "max element", "arr[i]": "last element" }
          },
          {
            lines: [13],
            title: "Return Sorted Array",
            description: "After all elements have been extracted from the heap and placed in their sorted positions, return the now-sorted array. The array has been sorted in-place in ascending order.",
            variables: { "arr": "[5, 6, 7, 11, 12, 13]" }
          },
          {
            lines: [15, 16, 17, 18],
            title: "Heapify Initialization",
            description: "Initialize the heapify process by assuming the largest element is at the current node index i. Calculate the indices of the left child (2*i + 1) and right child (2*i + 2) in the binary heap tree structure stored as an array.",
            variables: { "largest": "i", "left": "2*i + 1", "right": "2*i + 2" }
          },
          {
            lines: [20, 21, 22, 23, 24],
            title: "Find Largest Among Node and Children",
            description: "Compare the current node with its left and right children (if they exist within the heap boundary n). Update largest to point to the index of the maximum value among the node and its children. This identifies which element should be at the parent position in a max heap.",
            variables: { "arr[i]": "11", "arr[left]": "13", "arr[right]": "12", "largest": "left" }
          },
          {
            lines: [26, 27, 28],
            title: "Swap and Recursively Heapify",
            description: "If the largest element is not the current node, swap them using Python's tuple unpacking to satisfy the max heap property. Then recursively call heapify on the affected subtree to ensure it also maintains the max heap property, propagating changes down the tree.",
            variables: { "arr[i]": "11", "arr[largest]": "13" }
          }
        ]
      }
    ],
    keyInsights: [
      "Combines space efficiency (O(1)) with guaranteed time efficiency (O(n log n))",
      "Building the initial heap takes O(n) time, not O(n log n) as might be expected",
      "Poor cache locality compared to Quick Sort leads to slower practical performance",
      "Useful for finding k largest/smallest elements without fully sorting"
    ],
    whenToUse: [
      "When O(1) space complexity is required with guaranteed O(n log n) time",
      "When you need to repeatedly find minimum/maximum elements",
      "In memory-constrained environments where merge sort's O(n) space is prohibitive"
    ]
  },
  {
    id: "SRT_004",
    name: "Bubble Sort",
    category: "Sorting",
    difficulty: "Beginner",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order.",
    longDescription: "Bubble Sort is one of the simplest sorting algorithms to understand and implement. It works by repeatedly passing through the array, comparing each pair of adjacent elements and swapping them if they're in the wrong order. The algorithm gets its name because smaller elements 'bubble' to the top of the list. While highly inefficient for large datasets with O(n²) time complexity, it has educational value and can be optimized to detect if the array is already sorted. It's a stable sort and requires only O(1) additional space.",
    icon: "swap_vert",
    complexityScore: 0.3,
    tags: ["comparison-based", "stable", "in-place", "simple", "educational"],
    leetcodeProblems: [
      "Sort an Array",
      "Sort Colors",
      "Valid Anagram"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // If no swapping occurred, array is sorted
    if (!swapped) break;
  }

  return arr;
}

// Example usage
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(arr)); // [11, 12, 22, 25, 34, 64, 90]

// Time Complexity: O(n²) worst/average, O(n) best
// Space Complexity: O(1)`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize Array Length",
            description: "Store the length of the array in variable 'n'. This determines how many passes through the array we'll need to make.",
            variables: { "arr": "[64, 34, 25, 12, 22, 11, 90]", "n": "7" }
          },
          {
            lines: [4, 5],
            title: "Outer Loop - Passes",
            description: "The outer loop controls the number of passes through the array. We need at most n-1 passes because after each pass, the largest unsorted element 'bubbles up' to its correct position at the end. Initialize a 'swapped' flag to false for early termination optimization.",
            variables: { "i": "0", "n - 1": "6", "swapped": "false" }
          },
          {
            lines: [7, 8, 9, 10, 11],
            title: "Inner Loop - Compare Adjacent Elements",
            description: "The inner loop compares each pair of adjacent elements. The range 'n - i - 1' shrinks with each pass because the last i elements are already in their final sorted positions. If elements are out of order (arr[j] > arr[j+1]), swap them using destructuring and set swapped flag to true.",
            variables: { "j": "0", "arr[j]": "64", "arr[j + 1]": "34", "swapped": "true" }
          },
          {
            lines: [13, 14],
            title: "Early Termination Check",
            description: "If no swaps occurred during a complete pass (swapped is still false), the array is already sorted and we can exit early. This optimization makes bubble sort O(n) on already-sorted arrays instead of O(n²).",
            variables: { "swapped": "false", "remaining passes": "avoided" }
          },
          {
            lines: [16],
            title: "Return Sorted Array",
            description: "After all passes are complete (or early termination), return the sorted array. The array has been sorted in-place in ascending order.",
            variables: { "arr": "[11, 12, 22, 25, 34, 64, 90]" }
          }
        ]
      },
      {
        language: "python",
        code: `def bubble_sort(arr):
    n = len(arr)

    for i in range(n - 1):
        swapped = False

        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # If no swapping occurred, array is sorted
        if not swapped:
            break

    return arr

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(arr)
print(arr)  # [11, 12, 22, 25, 34, 64, 90]

# Optimized version with early termination
# Best case: O(n) when array is already sorted
# Worst case: O(n²) when array is reverse sorted`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize Array Length",
            description: "Store the length of the array in variable n. This determines how many passes through the array we'll need to make. We'll iterate at most n-1 times since each pass bubbles up the largest unsorted element.",
            variables: { "arr": "[64, 34, 25, 12, 22, 11, 90]", "n": "7" }
          },
          {
            lines: [4, 5],
            title: "Outer Loop - Control Passes",
            description: "The outer loop controls the number of passes through the array using range(n - 1). Initialize a swapped flag to False for each pass to track if any swaps occurred. This flag enables early termination optimization.",
            variables: { "i": "0 to 5", "swapped": "False" }
          },
          {
            lines: [7, 8, 9, 10],
            title: "Inner Loop - Compare and Swap",
            description: "The inner loop compares each pair of adjacent elements. The range(n - i - 1) shrinks with each pass because the last i elements are already in their final sorted positions. If elements are out of order, swap them using Python's tuple unpacking and set swapped flag to True.",
            variables: { "j": "0 to n-i-2", "arr[j]": "64", "arr[j + 1]": "34", "swapped": "True" }
          },
          {
            lines: [12, 13, 14],
            title: "Early Termination Check",
            description: "If no swaps occurred during a complete pass (swapped is still False), the array is already sorted and we can exit early using break. This optimization makes bubble sort O(n) on already-sorted arrays instead of O(n²).",
            variables: { "swapped": "False", "optimization": "early exit" }
          },
          {
            lines: [16],
            title: "Return Sorted Array",
            description: "After all passes are complete (or early termination), return the sorted array. The array has been sorted in-place in ascending order with each pass ensuring one more element is in its final position.",
            variables: { "arr": "[11, 12, 22, 25, 34, 64, 90]" }
          }
        ]
      }
    ],
    keyInsights: [
      "Simplest sorting algorithm to understand and implement, great for teaching",
      "Stable sort - maintains relative order of equal elements",
      "Adaptive - can terminate early if array becomes sorted (with optimization flag)",
      "After each pass, the largest unsorted element is guaranteed to be in its final position"
    ],
    whenToUse: [
      "For educational purposes to understand basic sorting concepts",
      "For very small datasets where simplicity matters more than efficiency",
      "When the array is nearly sorted (best case O(n) with early termination)"
    ]
  },
  {
    id: "SRT_005",
    name: "Insertion Sort",
    category: "Sorting",
    difficulty: "Beginner",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "A simple sorting algorithm that builds the final sorted array one item at a time by inserting elements into their correct position.",
    longDescription: "Insertion Sort works similarly to how you might sort playing cards in your hand. It iterates through the array, and for each element, it finds the appropriate position in the already-sorted portion and inserts it there. The algorithm maintains a sorted portion at the beginning of the array and gradually expands it. While it has O(n²) worst-case time complexity, it performs exceptionally well on small or nearly-sorted datasets, making it the algorithm of choice for small subarrays in hybrid sorting algorithms like TimSort and Introsort.",
    icon: "input",
    complexityScore: 0.25,
    tags: ["comparison-based", "stable", "in-place", "adaptive", "online"],
    leetcodeProblems: [
      "Sort an Array",
      "Insertion Sort List",
      "Sort List"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}

// Alternative with binary search for finding position
function insertionSortBinary(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    const pos = binarySearchPosition(arr, key, 0, i - 1);

    for (let j = i - 1; j >= pos; j--) {
      arr[j + 1] = arr[j];
    }
    arr[pos] = key;
  }
  return arr;
}

function binarySearchPosition(arr: number[], key: number, low: number, high: number): number {
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] > key) high = mid - 1;
    else low = mid + 1;
  }
  return low;
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Start From Second Element",
            description: "Begin the outer loop at index 1 (second element) since a single element is already considered sorted. Each iteration expands the sorted portion of the array by one element.",
            variables: { "arr": "[12, 11, 13, 5, 6]", "i": "1" }
          },
          {
            lines: [3, 4],
            title: "Store Key and Position",
            description: "Save the current element as 'key' - this is the element we're inserting into the sorted portion. Initialize 'j' to point to the last element of the sorted portion (i - 1). We'll compare the key against elements in the sorted portion moving backwards.",
            variables: { "key": "11", "i": "1", "j": "0" }
          },
          {
            lines: [6, 7, 8, 9],
            title: "Shift Larger Elements Right",
            description: "Move backwards through the sorted portion while elements are greater than the key. Shift each element one position to the right to make room for the key. This continues until we find the correct position (an element smaller than or equal to key) or reach the beginning of the array.",
            variables: { "arr[j]": "12", "key": "11", "j": "0 -> -1" }
          },
          {
            lines: [11],
            title: "Insert Key at Correct Position",
            description: "Place the key at position j+1, which is the first position where the element is not greater than the key. The sorted portion has now grown by one element and maintains its sorted order.",
            variables: { "j + 1": "0", "key": "11", "arr": "[11, 12, 13, 5, 6]" }
          },
          {
            lines: [13],
            title: "Return Sorted Array",
            description: "After all elements have been inserted into their correct positions, return the fully sorted array. The array has been sorted in-place with each element finding its position among the previously sorted elements.",
            variables: { "arr": "[5, 6, 11, 12, 13]" }
          },
          {
            lines: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            title: "Binary Search Optimization",
            description: "Alternative version that uses binary search to find the insertion position in O(log n) time instead of linear search. While this reduces comparisons, elements still need to be shifted, so overall time complexity remains O(n²). This optimization is beneficial when comparisons are expensive but movements are cheap.",
            variables: { "pos": "binary search result" }
          }
        ]
      },
      {
        language: "python",
        code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = key

    return arr

# Example usage
arr = [12, 11, 13, 5, 6]
insertion_sort(arr)
print(arr)  # [5, 6, 11, 12, 13]

# Optimized version with early break
def insertion_sort_optimized(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        if j + 1 != i:  # Only insert if position changed
            arr[j + 1] = key

    return arr`,
        steps: [
          {
            lines: [1, 2],
            title: "Start From Second Element",
            description: "Begin the outer loop at index 1 (second element) using range(1, len(arr)) since a single element is already considered sorted. Each iteration expands the sorted portion of the array by one element.",
            variables: { "arr": "[12, 11, 13, 5, 6]", "i": "1" }
          },
          {
            lines: [3, 4],
            title: "Store Key and Initialize Position",
            description: "Save the current element as key - this is the element we're inserting into the sorted portion. Initialize j to i - 1 to point to the last element of the sorted portion. We'll compare key against elements in the sorted portion moving backwards.",
            variables: { "key": "11", "i": "1", "j": "0" }
          },
          {
            lines: [6, 7, 8, 9],
            title: "Shift Larger Elements Right",
            description: "While j is valid (>= 0) and the element at j is greater than key, shift that element one position to the right and decrement j. This continues until we find the correct position (an element smaller than or equal to key) or reach the beginning of the array.",
            variables: { "arr[j]": "12", "key": "11", "j": "0 -> -1" }
          },
          {
            lines: [11],
            title: "Insert Key at Correct Position",
            description: "Place the key at position j + 1, which is the first position where the element is not greater than the key. The sorted portion has now grown by one element and maintains its sorted order.",
            variables: { "j + 1": "0", "key": "11", "arr": "[11, 12, 13, 5, 6]" }
          },
          {
            lines: [13],
            title: "Return Sorted Array",
            description: "After all elements have been inserted into their correct positions, return the fully sorted array. The array has been sorted in-place with each element finding its position among the previously sorted elements.",
            variables: { "arr": "[5, 6, 11, 12, 13]" }
          },
          {
            lines: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
            title: "Optimized Version",
            description: "Alternative optimized version that only performs the final assignment if the element's position actually changed (j + 1 != i). This micro-optimization avoids unnecessary writes when an element is already in its correct position, though it adds a comparison. The algorithm logic remains the same.",
            variables: { "j + 1 != i": "position changed check" }
          }
        ]
      }
    ],
    keyInsights: [
      "Extremely efficient for small arrays (typically n < 10-20), often used as base case in hybrid algorithms",
      "Online algorithm - can sort data as it's received, useful for streaming data",
      "Adaptive - runs in O(n) time when array is nearly sorted or already sorted",
      "Stable sort with excellent cache performance due to sequential access pattern"
    ],
    whenToUse: [
      "For small datasets (typically less than 20 elements)",
      "When the array is nearly sorted or partially sorted",
      "As the base case in hybrid sorting algorithms (QuickSort, MergeSort for small subarrays)"
    ]
  },
  {
    id: "SRT_006",
    name: "Selection Sort",
    category: "Sorting",
    difficulty: "Beginner",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "A simple comparison-based algorithm that repeatedly finds the minimum element from the unsorted portion and places it at the beginning.",
    longDescription: "Selection Sort divides the array into two portions: sorted and unsorted. It repeatedly selects the smallest (or largest) element from the unsorted portion and moves it to the end of the sorted portion. Unlike bubble sort or insertion sort, selection sort performs the same number of comparisons regardless of the initial order of elements, making it inefficient even for nearly-sorted data. However, it minimizes the number of swaps (at most n-1), which can be advantageous when writing to memory is expensive.",
    icon: "check_circle",
    complexityScore: 0.2,
    tags: ["comparison-based", "unstable", "in-place", "simple", "minimal-swaps"],
    leetcodeProblems: [
      "Sort an Array",
      "Largest Number",
      "Sort Colors"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Find the minimum element in unsorted portion
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap if a smaller element was found
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }

  return arr;
}

// Bidirectional selection sort (finds min and max each pass)
function bidirectionalSelectionSort(arr: number[]): number[] {
  let left = 0, right = arr.length - 1;

  while (left < right) {
    let minIdx = left, maxIdx = right;

    for (let i = left; i <= right; i++) {
      if (arr[i] < arr[minIdx]) minIdx = i;
      if (arr[i] > arr[maxIdx]) maxIdx = i;
    }

    [arr[left], arr[minIdx]] = [arr[minIdx], arr[left]];
    if (maxIdx === left) maxIdx = minIdx;
    [arr[right], arr[maxIdx]] = [arr[maxIdx], arr[right]];

    left++;
    right--;
  }
  return arr;
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize Array Length",
            description: "Store the array length in variable 'n'. We'll iterate n-1 times because after n-1 selections, the last element will automatically be in its correct position.",
            variables: { "arr": "[64, 25, 12, 22, 11]", "n": "5" }
          },
          {
            lines: [4, 5],
            title: "Outer Loop - Sorted Boundary",
            description: "The outer loop moves the boundary between sorted and unsorted portions of the array. Variable 'i' represents the current position to fill with the minimum element from the unsorted portion. Initialize minIdx to assume the current position holds the minimum.",
            variables: { "i": "0", "minIdx": "0" }
          },
          {
            lines: [7, 8, 9, 10, 11],
            title: "Find Minimum in Unsorted Portion",
            description: "Scan through the unsorted portion of the array (from i+1 to end) to find the index of the smallest element. Update minIdx whenever a smaller element is found. This is the 'selection' step that gives the algorithm its name.",
            variables: { "j": "1 to 4", "minIdx": "4", "arr[minIdx]": "11" }
          },
          {
            lines: [13, 14, 15],
            title: "Swap Minimum to Sorted Position",
            description: "If the minimum element is not already at position i, swap it with the element at position i using destructuring assignment. This places the minimum element in its final sorted position and expands the sorted portion by one element. This conditional swap is an optimization to avoid unnecessary swaps.",
            variables: { "arr[i]": "64", "arr[minIdx]": "11", "i": "0" }
          },
          {
            lines: [17],
            title: "Return Sorted Array",
            description: "After n-1 selections and swaps, return the sorted array. Each pass guarantees one more element is in its final position, resulting in a fully sorted array.",
            variables: { "arr": "[11, 12, 22, 25, 64]" }
          },
          {
            lines: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            title: "Bidirectional Optimization",
            description: "Alternative version that finds both minimum and maximum in each pass, placing them at both ends of the unsorted portion. This reduces the number of passes by half but requires more bookkeeping. Special handling is needed when maxIdx equals left before swapping.",
            variables: { "left": "0", "right": "4", "minIdx": "0", "maxIdx": "4" }
          }
        ]
      },
      {
        language: "python",
        code: `def selection_sort(arr):
    n = len(arr)

    for i in range(n - 1):
        min_idx = i

        # Find the minimum element in unsorted portion
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j

        # Swap if a smaller element was found
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]

    return arr

# Example usage
arr = [64, 25, 12, 22, 11]
selection_sort(arr)
print(arr)  # [11, 12, 22, 25, 64]

# Stable version (uses shifting instead of swapping)
def stable_selection_sort(arr):
    for i in range(len(arr) - 1):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j

        # Shift elements and insert
        key = arr[min_idx]
        while min_idx > i:
            arr[min_idx] = arr[min_idx - 1]
            min_idx -= 1
        arr[i] = key

    return arr`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize Array Length",
            description: "Store the array length in variable n. We'll iterate n-1 times because after n-1 selections, the last element will automatically be in its correct position as the largest remaining element.",
            variables: { "arr": "[64, 25, 12, 22, 11]", "n": "5" }
          },
          {
            lines: [4, 5],
            title: "Outer Loop - Sorted Boundary",
            description: "The outer loop using range(n - 1) moves the boundary between sorted and unsorted portions of the array. Variable i represents the current position to fill with the minimum element from the unsorted portion. Initialize min_idx to assume the current position holds the minimum.",
            variables: { "i": "0 to 3", "min_idx": "i" }
          },
          {
            lines: [7, 8, 9, 10],
            title: "Find Minimum in Unsorted Portion",
            description: "Scan through the unsorted portion of the array (from i+1 to end) using range(i + 1, n) to find the index of the smallest element. Update min_idx whenever a smaller element is found. This is the 'selection' step that gives the algorithm its name.",
            variables: { "j": "i+1 to n-1", "min_idx": "4", "arr[min_idx]": "11" }
          },
          {
            lines: [12, 13, 14],
            title: "Swap Minimum to Sorted Position",
            description: "If the minimum element is not already at position i (min_idx != i), swap it with the element at position i using Python's tuple unpacking. This places the minimum element in its final sorted position and expands the sorted portion by one element. The conditional avoids unnecessary self-swaps.",
            variables: { "arr[i]": "64", "arr[min_idx]": "11", "i": "0" }
          },
          {
            lines: [16],
            title: "Return Sorted Array",
            description: "After n-1 selections and swaps, return the sorted array. Each pass guarantees one more element is in its final position, resulting in a fully sorted array in ascending order.",
            variables: { "arr": "[11, 12, 22, 25, 64]" }
          },
          {
            lines: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
            title: "Stable Selection Sort Variant",
            description: "Alternative stable version that uses shifting instead of swapping. After finding the minimum element, it stores it in key, then shifts all elements between i and min_idx one position to the right, and finally inserts key at position i. This preserves the relative order of equal elements, making it a stable sort.",
            variables: { "key": "arr[min_idx]", "shifting": "preserves stability" }
          }
        ]
      }
    ],
    keyInsights: [
      "Performs minimum number of swaps (n-1) among all comparison-based sorts",
      "Not adaptive - always performs O(n²) comparisons regardless of initial order",
      "Unstable in its basic form but can be made stable with modifications",
      "Each pass guarantees one more element is in its final sorted position"
    ],
    whenToUse: [
      "When write operations are significantly more expensive than comparisons",
      "For small datasets where simplicity is valued",
      "When minimizing the number of swaps is important (e.g., swapping large objects)"
    ]
  },
  {
    id: "SRT_007",
    name: "Counting Sort",
    category: "Sorting",
    difficulty: "Medium",
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(k)",
    description: "A non-comparison based integer sorting algorithm that counts occurrences of each distinct element and uses arithmetic to determine positions.",
    longDescription: "Counting Sort operates on the principle that if you know how many elements are less than a given element, you can place it directly in its sorted position. It counts the frequency of each distinct element in the input array, then uses cumulative counts to determine the final position of each element. This algorithm achieves linear time complexity O(n + k) where k is the range of input values. It's particularly efficient when k is not significantly larger than n, making it ideal for sorting integers or objects with integer keys within a known range.",
    icon: "tag",
    complexityScore: 0.5,
    tags: ["non-comparison", "stable", "linear-time", "integer-sorting", "auxiliary-space"],
    leetcodeProblems: [
      "Sort Colors",
      "Sort an Array",
      "Maximum Gap"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return arr;

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  // Count occurrences
  for (const num of arr) {
    count[num - min]++;
  }

  // Calculate cumulative counts
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  // Build output array (iterate backwards for stability)
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];
    output[count[num - min] - 1] = num;
    count[num - min]--;
  }

  return output;
}

// Simplified version for non-negative integers
function countingSortSimple(arr: number[]): number[] {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);

  for (const num of arr) count[num]++;

  let idx = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i]-- > 0) arr[idx++] = i;
  }
  return arr;
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Handle Empty Array",
            description: "Check if the array is empty and return it immediately if so. This prevents errors when trying to find min/max values in subsequent steps.",
            variables: { "arr": "[4, 2, 2, 8, 3, 3, 1]", "arr.length": "7" }
          },
          {
            lines: [4, 5, 6],
            title: "Find Range of Values",
            description: "Determine the minimum and maximum values in the array, then calculate the range (difference + 1). This tells us how many counting buckets we need. Supporting negative numbers requires offset by min value.",
            variables: { "max": "8", "min": "1", "range": "8" }
          },
          {
            lines: [8, 9],
            title: "Initialize Count and Output Arrays",
            description: "Create a count array of size 'range' filled with zeros to store frequency of each value. Create an output array of the same size as input to hold the sorted result. The count array maps values to their frequencies using offset indexing (value - min).",
            variables: { "count": "[0, 0, 0, 0, 0, 0, 0, 0]", "output.length": "7" }
          },
          {
            lines: [11, 12, 13],
            title: "Count Occurrences",
            description: "Iterate through the input array and increment the count for each element. The index in the count array is calculated as (num - min) to handle negative numbers and minimize array size. This builds a frequency map of all values.",
            variables: { "count": "[1, 2, 2, 0, 0, 0, 0, 1]", "count[num - min]++": "frequency" }
          },
          {
            lines: [15, 16, 17],
            title: "Calculate Cumulative Counts",
            description: "Transform the count array into cumulative counts where each position contains the count of elements less than or equal to that value. This tells us the final position where each value should end up in the sorted array. count[i] now represents how many elements are ≤ i.",
            variables: { "count[i]": "cumulative sum", "count": "[1, 3, 5, 5, 5, 5, 5, 6]" }
          },
          {
            lines: [19, 20, 21, 22, 23],
            title: "Build Sorted Output",
            description: "Iterate backwards through the input array (for stability) and place each element at its correct position in the output array. The position is determined by count[num - min] - 1, then decrement the count. Backwards iteration ensures stable sort by preserving relative order of equal elements.",
            variables: { "num": "1", "count[num - min] - 1": "0", "output[0]": "1" }
          },
          {
            lines: [25],
            title: "Return Sorted Array",
            description: "Return the output array which now contains all elements sorted in ascending order. The original array is unchanged; this is a non-in-place sort.",
            variables: { "output": "[1, 2, 2, 3, 3, 4, 8]" }
          },
          {
            lines: [28, 29, 30, 31, 32, 33, 34, 35],
            title: "Simplified Non-Negative Version",
            description: "For non-negative integers starting from 0, we can simplify by eliminating the offset. Create a count array of size max+1, count frequencies, then reconstruct the array by outputting each value 'count[i]' times. This version modifies the array in-place but sacrifices stability.",
            variables: { "count[num]++": "direct indexing" }
          }
        ]
      },
      {
        language: "python",
        code: `def counting_sort(arr):
    if not arr:
        return arr

    max_val = max(arr)
    min_val = min(arr)
    range_size = max_val - min_val + 1

    count = [0] * range_size
    output = [0] * len(arr)

    # Count occurrences
    for num in arr:
        count[num - min_val] += 1

    # Calculate cumulative counts
    for i in range(1, len(count)):
        count[i] += count[i - 1]

    # Build output array (backwards for stability)
    for i in range(len(arr) - 1, -1, -1):
        num = arr[i]
        output[count[num - min_val] - 1] = num
        count[num - min_val] -= 1

    return output

# Example usage
arr = [4, 2, 2, 8, 3, 3, 1]
sorted_arr = counting_sort(arr)
print(sorted_arr)  # [1, 2, 2, 3, 3, 4, 8]

# Simple version for non-negative integers
def counting_sort_simple(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)

    for num in arr:
        count[num] += 1

    idx = 0
    for i, freq in enumerate(count):
        for _ in range(freq):
            arr[idx] = i
            idx += 1

    return arr`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Handle Empty Array",
            description: "Check if the array is empty using 'not arr' and return it immediately if so. This prevents errors when trying to find min/max values in subsequent steps.",
            variables: { "arr": "[4, 2, 2, 8, 3, 3, 1]", "len(arr)": "7" }
          },
          {
            lines: [5, 6, 7],
            title: "Find Range of Values",
            description: "Determine the minimum and maximum values in the array using Python's built-in max() and min() functions, then calculate the range size (difference + 1). This tells us how many counting buckets we need. Supporting negative numbers requires offset by min_val.",
            variables: { "max_val": "8", "min_val": "1", "range_size": "8" }
          },
          {
            lines: [9, 10],
            title: "Initialize Count and Output Arrays",
            description: "Create a count list of size range_size filled with zeros using list multiplication to store frequency of each value. Create an output list of the same size as input to hold the sorted result. The count array maps values to their frequencies using offset indexing (value - min_val).",
            variables: { "count": "[0] * 8", "output": "[0] * 7" }
          },
          {
            lines: [12, 13, 14],
            title: "Count Occurrences",
            description: "Iterate through the input array and increment the count for each element. The index in the count array is calculated as (num - min_val) to handle negative numbers and minimize array size. This builds a frequency map of all values.",
            variables: { "count": "[1, 2, 2, 0, 0, 0, 0, 1]", "num - min_val": "offset index" }
          },
          {
            lines: [16, 17, 18],
            title: "Calculate Cumulative Counts",
            description: "Transform the count array into cumulative counts using range(1, len(count)) where each position contains the count of elements less than or equal to that value. This tells us the final position where each value should end up in the sorted array. count[i] now represents how many elements are <= i.",
            variables: { "count[i]": "cumulative sum", "count": "[1, 3, 5, 5, 5, 5, 5, 6]" }
          },
          {
            lines: [20, 21, 22, 23, 24],
            title: "Build Sorted Output",
            description: "Iterate backwards through the input array using range(len(arr) - 1, -1, -1) for stability and place each element at its correct position in the output array. The position is determined by count[num - min_val] - 1, then decrement the count. Backwards iteration ensures stable sort by preserving relative order.",
            variables: { "num": "1", "count[num - min_val] - 1": "0", "output[0]": "1" }
          },
          {
            lines: [26],
            title: "Return Sorted Array",
            description: "Return the output array which now contains all elements sorted in ascending order. The original array is unchanged; this is a non-in-place sort requiring O(n) extra space.",
            variables: { "output": "[1, 2, 2, 3, 3, 4, 8]" }
          }
        ]
      }
    ],
    keyInsights: [
      "Achieves linear O(n + k) time complexity by avoiding comparisons entirely",
      "Stable when implemented correctly using cumulative counts and backward iteration",
      "Requires extra space O(k) where k is the range of input values",
      "Highly efficient when k (range) is not significantly larger than n (array size)"
    ],
    whenToUse: [
      "When sorting integers within a known, limited range",
      "When linear time complexity is required and extra space is acceptable",
      "As a subroutine in radix sort for sorting by individual digits"
    ]
  },
  {
    id: "SRT_008",
    name: "Radix Sort",
    category: "Sorting",
    difficulty: "Medium",
    timeComplexity: "O(nk)",
    spaceComplexity: "O(n + k)",
    description: "A non-comparison sorting algorithm that sorts integers by processing individual digits from least significant to most significant digit.",
    longDescription: "Radix Sort processes integers digit by digit, starting from the least significant digit (LSD) to the most significant digit (MSD), or vice versa. For each digit position, it uses a stable sorting algorithm (typically counting sort) as a subroutine. The key insight is that if we sort on the least significant digit first using a stable sort, then sort on the next digit, and so on, the result will be fully sorted. The time complexity is O(nk) where n is the number of elements and k is the number of digits in the largest number. It's particularly efficient for sorting large numbers of integers or strings of fixed length.",
    icon: "numbers",
    complexityScore: 0.55,
    tags: ["non-comparison", "stable", "digit-based", "linear-time", "multi-pass"],
    leetcodeProblems: [
      "Maximum Gap",
      "Sort an Array",
      "Sort Integers by The Number of 1 Bits"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function radixSort(arr: number[]): number[] {
  if (arr.length === 0) return arr;

  const max = Math.max(...arr);

  // Sort by each digit position
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }

  return arr;
}

function countingSortByDigit(arr: number[], exp: number): void {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  // Count occurrences of digits
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  // Calculate cumulative counts
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build output array
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  // Copy output to original array
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Handle Empty Array",
            description: "Check if the array is empty and return it immediately. This prevents errors in subsequent operations.",
            variables: { "arr": "[170, 45, 75, 90, 802, 24, 2, 66]", "arr.length": "8" }
          },
          {
            lines: [4],
            title: "Find Maximum Value",
            description: "Find the maximum value in the array to determine how many digits we need to process. The number of iterations equals the number of digits in the maximum value.",
            variables: { "max": "802", "digits": "3" }
          },
          {
            lines: [6, 7, 8],
            title: "Process Each Digit Position",
            description: "Iterate through each digit position from least significant (ones) to most significant. Variable 'exp' represents the current digit position (1 for ones, 10 for tens, 100 for hundreds, etc.). Continue until we've processed all digits of the maximum number. Use counting sort as a stable subroutine for each digit.",
            variables: { "exp": "1, 10, 100", "Math.floor(max / exp) > 0": "true" }
          },
          {
            lines: [10],
            title: "Return Sorted Array",
            description: "After processing all digit positions, return the fully sorted array. Each pass sorted by one digit position, and because we used stable sorting, the final result is completely sorted.",
            variables: { "arr": "[2, 24, 45, 66, 75, 90, 170, 802]" }
          },
          {
            lines: [13, 14, 15, 16],
            title: "Initialize Counting Sort by Digit",
            description: "Create output array to hold sorted values and count array of size 10 (for digits 0-9). These will be used to perform counting sort based on the current digit position specified by 'exp'.",
            variables: { "n": "8", "output": "new Array(8)", "count": "[0,0,0,0,0,0,0,0,0,0]" }
          },
          {
            lines: [18, 19, 20, 21],
            title: "Count Digit Occurrences",
            description: "Extract the digit at position 'exp' for each number using (arr[i] / exp) % 10, then increment the count for that digit. This builds a frequency distribution of digits at the current position.",
            variables: { "exp": "1", "digit": "(170 / 1) % 10 = 0", "count[0]++": "1" }
          },
          {
            lines: [23, 24, 25],
            title: "Calculate Cumulative Counts",
            description: "Transform count array into cumulative counts. Each position now contains the total count of digits less than or equal to that digit value. This determines where each number should be placed in the output.",
            variables: { "count": "[cumulative sums]" }
          },
          {
            lines: [27, 28, 29, 30, 31],
            title: "Build Sorted Output by Digit",
            description: "Iterate backwards through the input array (for stability) and place each number in its position based on its current digit. Decrement the count after placement. Backwards iteration preserves the relative order from previous passes.",
            variables: { "digit": "current digit", "output[position]": "arr[i]" }
          },
          {
            lines: [33, 34, 35],
            title: "Copy Back to Original Array",
            description: "Copy the sorted output back into the original array. This completes one pass of counting sort for the current digit position. The array is now sorted with respect to all digits processed so far.",
            variables: { "arr": "partially sorted by current digit" }
          }
        ]
      },
      {
        language: "python",
        code: `def radix_sort(arr):
    if not arr:
        return arr

    max_val = max(arr)

    # Sort by each digit position
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10

    return arr

def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10

    # Count occurrences of digits
    for i in range(n):
        digit = (arr[i] // exp) % 10
        count[digit] += 1

    # Calculate cumulative counts
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Build output array (backwards for stability)
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit] -= 1

    # Copy output to original array
    for i in range(n):
        arr[i] = output[i]

# Example usage
arr = [170, 45, 75, 90, 802, 24, 2, 66]
radix_sort(arr)
print(arr)  # [2, 24, 45, 66, 75, 90, 170, 802]`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Handle Empty Array",
            description: "Check if the array is empty using 'not arr' and return it immediately to prevent errors in subsequent operations. This is the base case for empty input.",
            variables: { "arr": "[170, 45, 75, 90, 802, 24, 2, 66]", "len(arr)": "8" }
          },
          {
            lines: [5],
            title: "Find Maximum Value",
            description: "Find the maximum value in the array using max() to determine how many digits we need to process. The number of iterations equals the number of digits in the maximum value, which determines how many passes of counting sort we need.",
            variables: { "max_val": "802", "digits": "3" }
          },
          {
            lines: [7, 8, 9, 10, 11],
            title: "Process Each Digit Position",
            description: "Initialize exp to 1 (ones place) and iterate through each digit position from least significant to most significant. While max_val // exp > 0, call counting_sort_by_digit for the current digit position, then multiply exp by 10 to move to the next digit. This processes ones, tens, hundreds, etc.",
            variables: { "exp": "1, 10, 100", "max_val // exp": "802, 80, 8" }
          },
          {
            lines: [13],
            title: "Return Sorted Array",
            description: "After processing all digit positions, return the fully sorted array. Each pass sorted by one digit position using stable counting sort, and the cumulative effect produces a completely sorted array.",
            variables: { "arr": "[2, 24, 45, 66, 75, 90, 170, 802]" }
          },
          {
            lines: [15, 16, 17, 18],
            title: "Initialize Counting Sort by Digit",
            description: "Create output list of size n to hold sorted values and count list of size 10 (for digits 0-9) filled with zeros. These will be used to perform counting sort based on the current digit position specified by exp.",
            variables: { "n": "8", "output": "[0] * 8", "count": "[0] * 10" }
          },
          {
            lines: [20, 21, 22, 23],
            title: "Count Digit Occurrences",
            description: "Extract the digit at position exp for each number using (arr[i] // exp) % 10, then increment the count for that digit. The // operator performs integer division and % extracts the digit. This builds a frequency distribution of digits at the current position.",
            variables: { "exp": "1", "digit": "(170 // 1) % 10 = 0", "count[0]": "1" }
          },
          {
            lines: [25, 26, 27],
            title: "Calculate Cumulative Counts",
            description: "Transform count array into cumulative counts using range(1, 10). Each position now contains the total count of digits less than or equal to that digit value. This determines where each number should be placed in the output based on its current digit.",
            variables: { "count": "[cumulative sums for digits 0-9]" }
          },
          {
            lines: [29, 30, 31, 32, 33],
            title: "Build Sorted Output by Digit",
            description: "Iterate backwards through the input array using range(n - 1, -1, -1) for stability and place each number in its position based on its current digit. Extract the digit, find its position using count[digit] - 1, place the number, and decrement the count. Backwards iteration preserves order from previous passes.",
            variables: { "digit": "current digit", "output[position]": "arr[i]" }
          },
          {
            lines: [35, 36, 37],
            title: "Copy Back to Original Array",
            description: "Copy the sorted output back into the original array using a simple loop with range(n). This completes one pass of counting sort for the current digit position. The array is now sorted with respect to all digits processed so far.",
            variables: { "arr": "partially sorted by current and previous digits" }
          }
        ]
      }
    ],
    keyInsights: [
      "Achieves linear time O(nk) where k is the number of digits, efficient when k is small",
      "Relies on stable sorting (counting sort) as subroutine to maintain correctness",
      "Can be adapted to sort strings, floating-point numbers, or custom keys",
      "LSD (Least Significant Digit) variant is simpler; MSD variant allows early termination"
    ],
    whenToUse: [
      "When sorting large collections of integers with a limited number of digits",
      "When linear time performance is needed and comparison-based O(n log n) is too slow",
      "For sorting fixed-length strings or records with numeric keys"
    ]
  },
  {
    id: "SRT_009",
    name: "Bucket Sort",
    category: "Sorting",
    difficulty: "Medium",
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(n)",
    description: "A distribution-based sorting algorithm that distributes elements into buckets, sorts each bucket individually, and concatenates the results.",
    longDescription: "Bucket Sort works by distributing elements into a number of buckets based on their value range. Each bucket is then sorted individually using another sorting algorithm (typically insertion sort for small buckets), and the sorted buckets are concatenated to produce the final sorted array. The algorithm performs best when input is uniformly distributed across the range, achieving O(n) average-case time complexity. It's particularly effective for floating-point numbers in a known range or when the input distribution is known in advance.",
    icon: "inventory_2",
    complexityScore: 0.5,
    tags: ["distribution-based", "stable", "uniform-distribution", "hybrid", "divide-and-conquer"],
    leetcodeProblems: [
      "Top K Frequent Elements",
      "Sort Colors",
      "Maximum Gap"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function bucketSort(arr: number[], bucketSize = 5): number[] {
  if (arr.length === 0) return arr;

  const min = Math.min(...arr);
  const max = Math.max(...arr);

  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  // Distribute elements into buckets
  for (const num of arr) {
    const bucketIndex = Math.floor((num - min) / bucketSize);
    buckets[bucketIndex].push(num);
  }

  // Sort each bucket and concatenate
  const result: number[] = [];
  for (const bucket of buckets) {
    insertionSort(bucket);
    result.push(...bucket);
  }

  return result;
}

function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// For floating point numbers in [0, 1)
function bucketSortFloat(arr: number[]): number[] {
  const n = arr.length;
  const buckets: number[][] = Array.from({ length: n }, () => []);

  for (const num of arr) {
    buckets[Math.floor(num * n)].push(num);
  }

  return buckets.flatMap(bucket => insertionSort(bucket));
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Handle Empty Array",
            description: "Check if the array is empty and return it immediately to avoid errors in subsequent operations.",
            variables: { "arr": "[42, 32, 33, 52, 37, 47, 51]", "arr.length": "7" }
          },
          {
            lines: [4, 5],
            title: "Find Value Range",
            description: "Determine the minimum and maximum values in the array. This range will be used to calculate which bucket each element belongs to, ensuring uniform distribution across buckets.",
            variables: { "min": "32", "max": "52", "range": "20" }
          },
          {
            lines: [7, 8],
            title: "Calculate Bucket Count and Initialize",
            description: "Calculate the number of buckets needed based on the range and bucket size parameter. Create an array of empty buckets. Each bucket will hold elements within a specific sub-range of values. The bucket size parameter controls the trade-off between bucket count and elements per bucket.",
            variables: { "bucketSize": "5", "bucketCount": "5", "buckets": "[[], [], [], [], []]" }
          },
          {
            lines: [10, 11, 12, 13],
            title: "Distribute Elements into Buckets",
            description: "Iterate through each element and calculate which bucket it belongs to using the formula: (num - min) / bucketSize. Push each element into its corresponding bucket. Elements with similar values end up in the same bucket.",
            variables: { "num": "42", "bucketIndex": "2", "buckets[2]": "[42]" }
          },
          {
            lines: [15, 16, 17, 18, 19, 20],
            title: "Sort Buckets and Concatenate",
            description: "Sort each individual bucket using insertion sort (efficient for small arrays) and concatenate all sorted buckets into the result array. Since buckets represent increasing value ranges and each is sorted internally, the concatenation produces a fully sorted array.",
            variables: { "bucket": "[42, 47]", "result": "[32, 33, 37, 42, 47, 51, 52]" }
          },
          {
            lines: [22],
            title: "Return Sorted Array",
            description: "Return the final sorted array created by concatenating all sorted buckets in order.",
            variables: { "result": "[32, 33, 37, 42, 47, 51, 52]" }
          },
          {
            lines: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
            title: "Insertion Sort Subroutine",
            description: "Helper function that performs insertion sort on individual buckets. This is efficient because buckets are typically small. The insertion sort iterates through the array, inserting each element into its correct position in the already-sorted portion.",
            variables: { "arr": "small bucket array" }
          },
          {
            lines: [44, 45, 46, 47, 48, 49, 50, 51],
            title: "Optimized Float Version [0, 1)",
            description: "Specialized version for floating-point numbers in the range [0, 1). Creates n buckets (where n = array length) and distributes each number to bucket[num * n]. This ensures approximately one element per bucket for uniformly distributed input, achieving O(n) average time. Uses flatMap to sort and concatenate in one step.",
            variables: { "n": "array length", "buckets[Math.floor(num * n)]": "bucket index" }
          }
        ]
      },
      {
        language: "python",
        code: `def bucket_sort(arr, bucket_size=5):
    if not arr:
        return arr

    min_val = min(arr)
    max_val = max(arr)

    bucket_count = (max_val - min_val) // bucket_size + 1
    buckets = [[] for _ in range(bucket_count)]

    # Distribute elements into buckets
    for num in arr:
        bucket_index = (num - min_val) // bucket_size
        buckets[bucket_index].append(num)

    # Sort each bucket and concatenate
    result = []
    for bucket in buckets:
        insertion_sort(bucket)
        result.extend(bucket)

    return result

def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Example usage
arr = [42, 32, 33, 52, 37, 47, 51]
sorted_arr = bucket_sort(arr)
print(sorted_arr)  # [32, 33, 37, 42, 47, 51, 52]

# For floating point numbers in [0, 1)
def bucket_sort_float(arr):
    n = len(arr)
    buckets = [[] for _ in range(n)]

    for num in arr:
        buckets[int(num * n)].append(num)

    result = []
    for bucket in buckets:
        result.extend(sorted(bucket))

    return result`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Handle Empty Array",
            description: "Check if the array is empty using 'not arr' and return it immediately to avoid errors in subsequent operations. This is the base case for empty input.",
            variables: { "arr": "[42, 32, 33, 52, 37, 47, 51]", "bucket_size": "5" }
          },
          {
            lines: [5, 6],
            title: "Find Value Range",
            description: "Determine the minimum and maximum values in the array using Python's built-in min() and max() functions. This range will be used to calculate which bucket each element belongs to, ensuring uniform distribution across buckets.",
            variables: { "min_val": "32", "max_val": "52", "range": "20" }
          },
          {
            lines: [8, 9],
            title: "Create Buckets",
            description: "Calculate the number of buckets needed using integer division (max_val - min_val) // bucket_size + 1. Create a list of empty lists using list comprehension [[] for _ in range(bucket_count)]. Each bucket will hold elements within a specific sub-range of values.",
            variables: { "bucket_count": "5", "buckets": "[[], [], [], [], []]" }
          },
          {
            lines: [11, 12, 13, 14],
            title: "Distribute Elements into Buckets",
            description: "Iterate through each element and calculate which bucket it belongs to using the formula (num - min_val) // bucket_size. Append each element to its corresponding bucket using append(). Elements with similar values end up in the same bucket.",
            variables: { "num": "42", "bucket_index": "2", "buckets[2]": "[42]" }
          },
          {
            lines: [16, 17, 18, 19, 20],
            title: "Sort Buckets and Concatenate",
            description: "Initialize an empty result list. For each bucket, sort it using insertion_sort (efficient for small arrays) and extend the result list with the sorted bucket. Since buckets represent increasing value ranges and each is sorted internally, concatenation produces a fully sorted array.",
            variables: { "bucket": "[42, 47]", "result": "[32, 33, 37, 42, 47, 51, 52]" }
          },
          {
            lines: [22],
            title: "Return Sorted Array",
            description: "Return the final sorted array created by concatenating all sorted buckets in order. The distribution and sort-within-buckets approach achieves efficient sorting when input is uniformly distributed.",
            variables: { "result": "[32, 33, 37, 42, 47, 51, 52]" }
          },
          {
            lines: [24, 25, 26, 27, 28, 29, 30, 31, 32],
            title: "Insertion Sort Helper",
            description: "Helper function that performs insertion sort on individual buckets. Uses range(1, len(arr)) to iterate from the second element. For each element, shifts larger elements right and inserts the key at the correct position. This is efficient because buckets are typically small.",
            variables: { "arr": "small bucket", "key": "element to insert" }
          },
          {
            lines: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
            title: "Optimized Float Version",
            description: "Specialized version for floating-point numbers in range [0, 1). Creates n buckets and distributes each number to buckets[int(num * n)]. For uniformly distributed input, this ensures approximately one element per bucket, achieving O(n) average time. Uses Python's built-in sorted() for each bucket and extend() to concatenate.",
            variables: { "n": "len(arr)", "buckets[int(num * n)]": "bucket index" }
          }
        ]
      }
    ],
    keyInsights: [
      "Average-case O(n) when input is uniformly distributed across range",
      "Performance degrades to O(n²) if all elements fall into one bucket",
      "Choice of bucket size and distribution function crucial for performance",
      "Works well as a preprocessing step combined with other sorting algorithms"
    ],
    whenToUse: [
      "When input is uniformly distributed over a known range",
      "For sorting floating-point numbers in a specific range (e.g., [0, 1))",
      "When you have knowledge about the input distribution"
    ]
  },
  {
    id: "SRT_010",
    name: "Tim Sort",
    category: "Sorting",
    difficulty: "Advanced",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "A hybrid stable sorting algorithm derived from merge sort and insertion sort, designed to perform well on real-world data with natural runs.",
    longDescription: "TimSort is a sophisticated hybrid sorting algorithm that combines merge sort and insertion sort, specifically designed to perform well on many kinds of real-world data. It identifies already-ordered subsequences (runs) in the data and uses them to sort more efficiently. For small runs (typically < 64 elements), it uses insertion sort, while larger runs are merged using an optimized merge strategy. TimSort is the default sorting algorithm in Python, Java, and the Android platform because of its excellent performance on partially-ordered data, achieving O(n) best-case and O(n log n) worst-case time complexity while maintaining stability.",
    icon: "auto_awesome",
    complexityScore: 0.85,
    tags: ["hybrid", "stable", "adaptive", "production-grade", "runs-based"],
    leetcodeProblems: [
      "Sort an Array",
      "Merge Sorted Array",
      "Sort List"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `const MIN_MERGE = 32;

function timSort(arr: number[]): number[] {
  const n = arr.length;

  // Sort individual runs using insertion sort
  for (let start = 0; start < n; start += MIN_MERGE) {
    const end = Math.min(start + MIN_MERGE - 1, n - 1);
    insertionSort(arr, start, end);
  }

  // Merge sorted runs
  let size = MIN_MERGE;
  while (size < n) {
    for (let start = 0; start < n; start += size * 2) {
      const mid = start + size - 1;
      const end = Math.min(start + size * 2 - 1, n - 1);

      if (mid < end) {
        merge(arr, start, mid, end);
      }
    }
    size *= 2;
  }

  return arr;
}

function insertionSort(arr: number[], left: number, right: number): void {
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

function merge(arr: number[], left: number, mid: number, right: number): void {
  const leftPart = arr.slice(left, mid + 1);
  const rightPart = arr.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  while (i < leftPart.length && j < rightPart.length) {
    if (leftPart[i] <= rightPart[j]) {
      arr[k++] = leftPart[i++];
    } else {
      arr[k++] = rightPart[j++];
    }
  }

  while (i < leftPart.length) arr[k++] = leftPart[i++];
  while (j < rightPart.length) arr[k++] = rightPart[j++];
}`,
        steps: [
          {
            lines: [1, 2, 3],
            title: "Define Minimum Run Size",
            description: "Set MIN_MERGE constant to 32, which is the minimum size of runs that will be merged. This value is chosen based on empirical analysis - runs smaller than this are sorted using insertion sort, which is faster for small arrays. Get the array length for subsequent calculations.",
            variables: { "MIN_MERGE": "32", "n": "array length" }
          },
          {
            lines: [5, 6, 7, 8],
            title: "Sort Individual Runs with Insertion Sort",
            description: "Divide the array into runs of size MIN_MERGE and sort each run using insertion sort. Insertion sort is very efficient for small arrays and creates the initial sorted runs. The last run may be smaller than MIN_MERGE if the array length is not evenly divisible.",
            variables: { "start": "0, 32, 64, ...", "end": "min(start + 31, n - 1)" }
          },
          {
            lines: [10, 11],
            title: "Initialize Merge Size",
            description: "Start merging with runs of size MIN_MERGE. The merge size will double with each iteration (32, 64, 128, ...) following a bottom-up merge sort pattern. Continue until size exceeds array length.",
            variables: { "size": "32", "size < n": "true" }
          },
          {
            lines: [12, 13, 14, 15, 16, 17, 18],
            title: "Merge Adjacent Runs",
            description: "Iterate through the array in steps of 'size * 2', merging pairs of adjacent sorted runs. Calculate the middle point and end point for each merge operation. Only merge if there are actually two runs to merge (mid < end). This creates progressively larger sorted runs.",
            variables: { "start": "0, 64, 128, ...", "mid": "start + size - 1", "end": "min(start + size*2 - 1, n - 1)" }
          },
          {
            lines: [19],
            title: "Double Merge Size",
            description: "After merging all pairs at the current size level, double the merge size for the next iteration. This continues the bottom-up merging until the entire array is one sorted run.",
            variables: { "size": "32 -> 64 -> 128 -> ..." }
          },
          {
            lines: [21],
            title: "Return Sorted Array",
            description: "After all runs have been merged into a single sorted array, return the result. The array has been sorted in-place using a combination of insertion sort for small runs and merge sort for combining them.",
            variables: { "arr": "fully sorted array" }
          },
          {
            lines: [24, 25, 26, 27, 28, 29, 30, 31],
            title: "Insertion Sort for Runs",
            description: "Helper function that sorts a specific range [left, right] of the array using insertion sort. This is called for each initial run of size MIN_MERGE. Insertion sort works well on small, partially-ordered data.",
            variables: { "left": "start index", "right": "end index" }
          },
          {
            lines: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
            title: "Merge Function",
            description: "Helper function that merges two sorted subarrays [left, mid] and [mid+1, right] into a single sorted array. Creates temporary copies of both halves, then merges them back into the original array by comparing elements from each half. Appends any remaining elements from either half after one is exhausted.",
            variables: { "leftPart": "arr[left:mid+1]", "rightPart": "arr[mid+1:right+1]" }
          }
        ]
      },
      {
        language: "python",
        code: `MIN_MERGE = 32

def tim_sort(arr):
    n = len(arr)

    # Sort individual runs using insertion sort
    for start in range(0, n, MIN_MERGE):
        end = min(start + MIN_MERGE - 1, n - 1)
        insertion_sort_range(arr, start, end)

    # Merge sorted runs
    size = MIN_MERGE
    while size < n:
        for start in range(0, n, size * 2):
            mid = start + size - 1
            end = min(start + size * 2 - 1, n - 1)

            if mid < end:
                merge(arr, start, mid, end)

        size *= 2

    return arr

def insertion_sort_range(arr, left, right):
    for i in range(left + 1, right + 1):
        key = arr[i]
        j = i - 1
        while j >= left and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

def merge(arr, left, mid, right):
    left_part = arr[left:mid + 1]
    right_part = arr[mid + 1:right + 1]

    i = j = 0
    k = left

    while i < len(left_part) and j < len(right_part):
        if left_part[i] <= right_part[j]:
            arr[k] = left_part[i]
            i += 1
        else:
            arr[k] = right_part[j]
            j += 1
        k += 1

    while i < len(left_part):
        arr[k] = left_part[i]
        i += 1
        k += 1

    while j < len(right_part):
        arr[k] = right_part[j]
        j += 1
        k += 1

# Example usage
arr = [5, 21, 7, 23, 19, 3, 11, 13, 2, 6]
tim_sort(arr)
print(arr)`,
        steps: [
          {
            lines: [1],
            title: "Define MIN_MERGE constant",
            description: "Set the minimum run size to 32. Tim Sort divides the array into small runs and sorts each with insertion sort, which is efficient for small arrays. Runs shorter than MIN_MERGE are extended using insertion sort."
          },
          {
            lines: [3, 4, 5, 6, 7, 8, 9],
            title: "Sort individual runs",
            description: "Divide the array into runs of size MIN_MERGE and sort each one using insertion sort. Insertion sort is O(n^2) in general but very efficient for small arrays due to low overhead and good cache behavior.",
            variables: { "MIN_MERGE": "32", "n": "len(arr)" }
          },
          {
            lines: [12, 13, 14, 15, 16, 17, 18, 19, 21],
            title: "Merge sorted runs",
            description: "Iteratively merge adjacent sorted runs, doubling the merge size each pass. Start with runs of size MIN_MERGE, merge into runs of 2*MIN_MERGE, then 4*MIN_MERGE, and so on until the entire array is sorted.",
            variables: { "size": "MIN_MERGE, 64, 128, ..." }
          },
          {
            lines: [25, 26, 27, 28, 29, 30, 31, 32],
            title: "Insertion sort for small ranges",
            description: "Helper function that performs insertion sort on a subarray from index left to right. Each element is inserted into its correct position among the previously sorted elements by shifting larger elements to the right."
          },
          {
            lines: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
            title: "Merge two sorted subarrays",
            description: "Merge function combines two adjacent sorted subarrays into a single sorted subarray. Creates temporary copies of both halves, then interleaves elements back in sorted order. Appends remaining elements from whichever half still has unprocessed items.",
            variables: { "left_part": "arr[left:mid+1]", "right_part": "arr[mid+1:right+1]" }
          }
        ]
      }
    ],
    keyInsights: [
      "Exploits natural ordering in data by identifying and merging existing runs",
      "Uses insertion sort for small runs (< 64 elements) due to its efficiency on small data",
      "Adaptive - performs exceptionally well (O(n)) on already sorted or reverse-sorted data",
      "Production-proven algorithm used in Python's sorted(), Java Arrays.sort(), and Android"
    ],
    whenToUse: [
      "As a default general-purpose sorting algorithm in production systems",
      "When dealing with real-world data that often contains pre-sorted sequences",
      "When both stability and excellent average-case performance are required"
    ]
  },
  {
    id: "SRT_011",
    name: "Shell Sort",
    category: "Sorting",
    difficulty: "Medium",
    timeComplexity: "O(n log²n)",
    spaceComplexity: "O(1)",
    description: "An in-place comparison sort that generalizes insertion sort by allowing exchanges of elements that are far apart, using a gap sequence.",
    longDescription: "Shell Sort is an optimization over insertion sort that allows the exchange of items that are far apart. The algorithm sorts elements at specific intervals (gaps) apart, gradually reducing the gap until it becomes 1, at which point it performs a final insertion sort pass. The key insight is that by pre-sorting elements at larger gaps first, the array becomes 'nearly sorted,' which allows insertion sort to work efficiently in the final pass. The choice of gap sequence significantly affects performance - common sequences include Shell's original (n/2, n/4, ..., 1), Knuth's (1, 4, 13, 40, ...), and Sedgewick's sequences.",
    icon: "layers",
    complexityScore: 0.6,
    tags: ["comparison-based", "in-place", "unstable", "gap-sequence", "adaptive"],
    leetcodeProblems: [
      "Sort an Array",
      "Sort List",
      "Wiggle Sort"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `function shellSort(arr: number[]): number[] {
  const n = arr.length;

  // Start with a large gap and reduce
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Perform gapped insertion sort
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }

      arr[j] = temp;
    }
  }

  return arr;
}

// Shell sort with Knuth's gap sequence (1, 4, 13, 40, 121, ...)
function shellSortKnuth(arr: number[]): number[] {
  const n = arr.length;

  // Calculate initial gap using Knuth's sequence: h = 3*h + 1
  let gap = 1;
  while (gap < n / 3) {
    gap = 3 * gap + 1;
  }

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }

      arr[j] = temp;
    }
    gap = Math.floor(gap / 3);
  }

  return arr;
}`,
        steps: [
          {
            lines: [1, 2],
            title: "Initialize Array Length",
            description: "Store the array length. This will be used to calculate the initial gap and determine iteration bounds.",
            variables: { "arr": "[12, 34, 54, 2, 3]", "n": "5" }
          },
          {
            lines: [4],
            title: "Start with Large Gap",
            description: "Initialize the gap to n/2 (half the array length). The gap represents the distance between elements being compared. We start with a large gap and gradually reduce it to 1, which is why Shell Sort is sometimes called 'diminishing increment sort'. This initial gap is Shell's original sequence.",
            variables: { "gap": "2", "Math.floor(n / 2)": "2" }
          },
          {
            lines: [5, 6],
            title: "Gapped Insertion Sort",
            description: "For each gap value, perform insertion sort on elements that are 'gap' distance apart. Start from index 'gap' and insert each element into its correct position among the elements that are 'gap' positions apart. This is like running multiple interleaved insertion sorts.",
            variables: { "i": "gap to n-1", "temp": "arr[i]" }
          },
          {
            lines: [7, 8, 9, 10, 11, 12],
            title: "Shift Elements Within Gap",
            description: "Starting at position i, move backwards in steps of 'gap' while elements are greater than temp. Shift each element forward by 'gap' positions to make room. This creates sorted subsequences of elements that are 'gap' apart.",
            variables: { "j": "i, i-gap, i-2*gap, ...", "arr[j - gap]": "compare with temp" }
          },
          {
            lines: [14],
            title: "Insert Element at Correct Position",
            description: "Place temp at position j, which is the correct position in the gap-sorted subsequence. After this, elements at indices 0, gap, 2*gap, 3*gap, ... that include this element are sorted among themselves.",
            variables: { "arr[j]": "temp" }
          },
          {
            lines: [4, 4],
            title: "Reduce Gap",
            description: "After completing insertion sort for the current gap, reduce the gap by half. Continue until gap becomes 0. When gap = 1, this performs a final regular insertion sort, but the array is already nearly sorted, making it very fast.",
            variables: { "gap": "gap/2 (e.g., 2 -> 1 -> 0)" }
          },
          {
            lines: [17],
            title: "Return Sorted Array",
            description: "After the gap reduces to 0, return the fully sorted array. The combination of pre-sorting with large gaps and final insertion sort with gap=1 is much faster than standard insertion sort.",
            variables: { "arr": "[2, 3, 12, 34, 54]" }
          },
          {
            lines: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
            title: "Knuth's Gap Sequence Variant",
            description: "Alternative implementation using Knuth's gap sequence: (3^k - 1)/2 or equivalently h = 3*h + 1. This sequence (1, 4, 13, 40, 121, ...) has been proven to perform better than Shell's original sequence. Calculate the maximum gap first, then work backwards, reducing by dividing by 3 each time. This typically provides better performance than the n/2 sequence.",
            variables: { "gap": "1, 4, 13, 40, ...", "formula": "h = 3*h + 1" }
          }
        ]
      },
      {
        language: "python",
        code: `def shell_sort(arr):
    n = len(arr)
    gap = n // 2

    # Start with a large gap and reduce
    while gap > 0:
        # Perform gapped insertion sort
        for i in range(gap, n):
            temp = arr[i]
            j = i

            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap

            arr[j] = temp

        gap //= 2

    return arr

# Shell sort with Knuth's gap sequence
def shell_sort_knuth(arr):
    n = len(arr)

    # Calculate initial gap using Knuth's sequence
    gap = 1
    while gap < n // 3:
        gap = 3 * gap + 1

    while gap >= 1:
        for i in range(gap, n):
            temp = arr[i]
            j = i

            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap

            arr[j] = temp

        gap //= 3

    return arr

# Example usage
arr = [12, 34, 54, 2, 3]
shell_sort(arr)
print(arr)  # [2, 3, 12, 34, 54]

arr2 = [9, 8, 7, 6, 5, 4, 3, 2, 1]
shell_sort_knuth(arr2)
print(arr2)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]`
      ,
        steps: [
                  {
                            "lines": [
                                      1,
                                      2,
                                      3,
                                      5
                            ],
                            "title": "Define shell_sort",
                            "description": "Define the shell_sort function which takes arr as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      6,
                                      7,
                                      8,
                                      9,
                                      10,
                                      12,
                                      13,
                                      14
                            ],
                            "title": "While Loop",
                            "description": "Continue looping while the condition gap > 0 holds true."
                  },
                  {
                            "lines": [
                                      20,
                                      22
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: arr. This is the final output of the function."
                  },
                  {
                            "lines": [
                                      23,
                                      24,
                                      26,
                                      27
                            ],
                            "title": "Define shell_sort_knuth",
                            "description": "Define the shell_sort_knuth function which takes arr as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      28,
                                      29
                            ],
                            "title": "While Loop",
                            "description": "Continue looping while the condition gap < n // 3 holds true."
                  },
                  {
                            "lines": [
                                      31,
                                      32,
                                      33,
                                      34,
                                      36,
                                      37,
                                      38,
                                      40
                            ],
                            "title": "While Loop",
                            "description": "Continue looping while the condition gap >= 1 holds true."
                  },
                  {
                            "lines": [
                                      44,
                                      46
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: arr. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Improves insertion sort by eliminating large amounts of disorder early with large gaps",
      "Performance heavily depends on gap sequence choice - Knuth and Sedgewick sequences perform better",
      "Unstable sort but requires only O(1) auxiliary space",
      "Practical for medium-sized arrays (thousands of elements) with good cache performance"
    ],
    whenToUse: [
      "For medium-sized arrays where O(n log n) algorithms might have too much overhead",
      "When O(1) space complexity is required and O(n log n) time is acceptable",
      "In embedded systems or situations where simple, in-place sorting is needed"
    ]
  },
  {
    id: "SRT_012",
    name: "Topological Sort",
    category: "Graphs",
    difficulty: "Medium",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description: "A linear ordering of vertices in a directed acyclic graph (DAG) where for every directed edge (u, v), vertex u comes before v in the ordering.",
    longDescription: "Topological Sort produces a linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge from vertex u to vertex v, u appears before v in the ordering. This is essential for tasks like dependency resolution, task scheduling, and build systems. Two common approaches exist: Kahn's algorithm (BFS-based using in-degrees) and DFS-based approach. The algorithm can detect cycles - if a topological ordering cannot be produced, the graph contains a cycle. Applications include course prerequisite scheduling, build system dependency resolution, and determining compilation order.",
    icon: "route",
    complexityScore: 0.65,
    tags: ["graph-algorithm", "dag", "dependency-resolution", "dfs", "bfs"],
    leetcodeProblems: [
      "Course Schedule",
      "Course Schedule II",
      "Alien Dictionary"
    ],
    codeExamples: [
      {
        language: "typescript",
        code: `// Kahn's Algorithm (BFS-based)
function topologicalSortKahn(numVertices: number, edges: number[][]): number[] {
  const inDegree = new Array(numVertices).fill(0);
  const adjList: number[][] = Array.from({ length: numVertices }, () => []);

  // Build adjacency list and calculate in-degrees
  for (const [from, to] of edges) {
    adjList[from].push(to);
    inDegree[to]++;
  }

  // Start with vertices having 0 in-degree
  const queue: number[] = [];
  for (let i = 0; i < numVertices; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const result: number[] = [];

  while (queue.length > 0) {
    const vertex = queue.shift()!;
    result.push(vertex);

    for (const neighbor of adjList[vertex]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If result doesn't contain all vertices, there's a cycle
  return result.length === numVertices ? result : [];
}

// DFS-based approach
function topologicalSortDFS(numVertices: number, edges: number[][]): number[] {
  const adjList: number[][] = Array.from({ length: numVertices }, () => []);

  for (const [from, to] of edges) {
    adjList[from].push(to);
  }

  const visited = new Array(numVertices).fill(false);
  const stack: number[] = [];

  function dfs(vertex: number): boolean {
    visited[vertex] = true;

    for (const neighbor of adjList[vertex]) {
      if (!visited[neighbor]) {
        if (!dfs(neighbor)) return false;
      }
    }

    stack.push(vertex);
    return true;
  }

  for (let i = 0; i < numVertices; i++) {
    if (!visited[i]) {
      if (!dfs(i)) return [];
    }
  }

  return stack.reverse();
}`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: "Initialize Data Structures (Kahn's)",
            description: "Create an in-degree array to count incoming edges for each vertex and an adjacency list to store the graph. In-degree tracks how many dependencies each vertex has. Kahn's algorithm is BFS-based and processes vertices with no dependencies first.",
            variables: { "inDegree": "[0, 0, 0, ...]", "adjList": "empty arrays" }
          },
          {
            lines: [6, 7, 8, 9],
            title: "Build Graph and Count In-Degrees",
            description: "Iterate through all edges to build the adjacency list representation of the directed graph. For each edge (from, to), add 'to' to from's adjacency list and increment the in-degree of 'to'. This builds the dependency graph structure.",
            variables: { "edge": "[1, 0]", "adjList[1]": "[0]", "inDegree[0]": "1" }
          },
          {
            lines: [11, 12, 13, 14],
            title: "Initialize Queue with Zero In-Degree",
            description: "Find all vertices with in-degree 0 (no dependencies) and add them to the queue. These vertices can be processed immediately as they don't depend on any other vertices. This initializes the BFS traversal.",
            variables: { "queue": "[vertices with inDegree = 0]" }
          },
          {
            lines: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            title: "Process Vertices in Topological Order",
            description: "While the queue is not empty, remove a vertex, add it to the result, and decrease the in-degree of all its neighbors. When a neighbor's in-degree becomes 0, add it to the queue. This ensures we only process a vertex after all its dependencies have been processed. The BFS order guarantees a valid topological ordering.",
            variables: { "vertex": "current vertex", "inDegree[neighbor]--": "decrease dependency count" }
          },
          {
            lines: [27, 28],
            title: "Cycle Detection",
            description: "If the result contains all vertices, a valid topological ordering exists and is returned. If the result has fewer vertices than the graph, a cycle exists (some vertices never reached in-degree 0) and we return an empty array to indicate failure. This is how Kahn's algorithm detects cycles.",
            variables: { "result.length": "processed vertices", "numVertices": "total vertices" }
          },
          {
            lines: [31, 32, 33, 34, 35, 36],
            title: "DFS Approach Setup",
            description: "Alternative DFS-based approach. Build an adjacency list from edges and initialize a visited array to track processed vertices. Create a stack to store the topological order (vertices are added in reverse post-order).",
            variables: { "visited": "[false, false, ...]", "stack": "[]" }
          },
          {
            lines: [38, 39, 40, 41, 42, 43, 44, 45, 46],
            title: "DFS Helper Function",
            description: "Recursive DFS function marks a vertex as visited, then recursively visits all unvisited neighbors. After visiting all descendants, push the vertex onto the stack. This post-order traversal ensures dependencies are processed before the vertex itself. The stack will contain vertices in reverse topological order.",
            variables: { "vertex": "current", "visited[vertex]": "true" }
          },
          {
            lines: [48, 49, 50, 51, 52],
            title: "Run DFS from All Vertices",
            description: "Iterate through all vertices and run DFS from any unvisited vertex. This ensures all connected components are processed. The DFS approach handles disconnected graphs correctly.",
            variables: { "i": "0 to numVertices-1" }
          },
          {
            lines: [54],
            title: "Reverse Stack for Final Order",
            description: "Reverse the stack to get the correct topological order. DFS adds vertices in reverse post-order (dependencies after dependents), so reversing gives us the proper order where dependencies come before dependents.",
            variables: { "stack": "[3, 2, 1, 0]", "reversed": "[0, 1, 2, 3]" }
          }
        ]
      },
      {
        language: "python",
        code: `from collections import deque, defaultdict

# Kahn's Algorithm (BFS-based)
def topological_sort_kahn(num_vertices, edges):
    in_degree = [0] * num_vertices
    adj_list = defaultdict(list)

    # Build adjacency list and calculate in-degrees
    for from_v, to_v in edges:
        adj_list[from_v].append(to_v)
        in_degree[to_v] += 1

    # Start with vertices having 0 in-degree
    queue = deque([i for i in range(num_vertices) if in_degree[i] == 0])
    result = []

    while queue:
        vertex = queue.popleft()
        result.append(vertex)

        for neighbor in adj_list[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If result doesn't contain all vertices, there's a cycle
    return result if len(result) == num_vertices else []

# DFS-based approach
def topological_sort_dfs(num_vertices, edges):
    adj_list = defaultdict(list)

    for from_v, to_v in edges:
        adj_list[from_v].append(to_v)

    visited = [False] * num_vertices
    stack = []

    def dfs(vertex):
        visited[vertex] = True

        for neighbor in adj_list[vertex]:
            if not visited[neighbor]:
                dfs(neighbor)

        stack.append(vertex)

    for i in range(num_vertices):
        if not visited[i]:
            dfs(i)

    return stack[::-1]

# Example: Course scheduling
edges = [[1, 0], [2, 0], [3, 1], [3, 2]]
num_courses = 4
print(topological_sort_kahn(num_courses, edges))  # [0, 1, 2, 3] or [0, 2, 1, 3]`
      ,
        steps: [
                  {
                            "lines": [
                                      4,
                                      5,
                                      6,
                                      8,
                                      9,
                                      10,
                                      11,
                                      13,
                                      14,
                                      15
                            ],
                            "title": "Define topological_sort_kahn",
                            "description": "Define the topological_sort_kahn function which takes num_vertices, edges as parameters. This sets up the function signature and documents its interface. This section of the algorithm processes the data."
                  },
                  {
                            "lines": [
                                      17,
                                      18,
                                      19,
                                      21,
                                      22,
                                      23,
                                      24,
                                      26
                            ],
                            "title": "While Loop",
                            "description": "Continue looping while the condition queue holds true."
                  },
                  {
                            "lines": [
                                      27,
                                      29,
                                      30,
                                      31
                            ],
                            "title": "Return Result",
                            "description": "Return the computed result: result if len(result) == num_vertices else []. This is the final output of the function. Define the topological_sort_dfs function which takes num_vertices, edges as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      33,
                                      34,
                                      36,
                                      37
                            ],
                            "title": "Iteration Loop",
                            "description": "This section of the algorithm processes the data."
                  },
                  {
                            "lines": [
                                      39,
                                      40,
                                      42,
                                      43,
                                      44,
                                      46
                            ],
                            "title": "Define dfs",
                            "description": "Define the dfs function which takes vertex as parameters. This sets up the function signature and documents its interface."
                  },
                  {
                            "lines": [
                                      48,
                                      49,
                                      50,
                                      52,
                                      54
                            ],
                            "title": "Iteration Loop",
                            "description": "Iterate through range(num_vertices) using variable 'i'. Each iteration processes one element. Return the computed result: stack[::-1]. This is the final output of the function."
                  }
        ]
      }
    ],
    keyInsights: [
      "Only works on Directed Acyclic Graphs (DAGs) - presence of cycle makes ordering impossible",
      "Multiple valid topological orderings can exist for the same graph",
      "Kahn's algorithm naturally detects cycles - if output size < vertex count, cycle exists",
      "Essential for dependency resolution in build systems, package managers, and task schedulers"
    ],
    whenToUse: [
      "When scheduling tasks with dependencies (e.g., course prerequisites, build dependencies)",
      "For determining a valid order of execution in dependency graphs",
      "When you need to detect circular dependencies in a directed graph"
    ]
  }
];
