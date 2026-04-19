import type { Algorithm } from "../types/algorithm";

export const miscAlgorithms: Algorithm[] = [
  // Math Algorithms
  {
    id: "MAT_001",
    name: "Sieve of Eratosthenes",
    category: "Math",
    difficulty: "Medium",
    timeComplexity: "O(n log log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.45,
    icon: "filter_alt",
    description: "An ancient algorithm for finding all prime numbers up to a given limit by iteratively marking multiples of each prime.",
    longDescription: "The Sieve of Eratosthenes efficiently generates all prime numbers up to a specified integer n. It works by iteratively marking the multiples of each prime starting from 2. All unmarked numbers remaining after the process are prime. This algorithm is significantly faster than testing each number individually for primality, making it ideal for generating large lists of primes. The name comes from the Greek mathematician Eratosthenes who invented it in the 3rd century BC.",
    tags: ["primes", "number-theory", "array", "optimization", "mathematical"],
    leetcodeProblems: ["Count Primes", "Ugly Number II", "Perfect Squares"],
    codeExamples: [
      {
        language: "typescript",
        code: `function sieveOfEratosthenes(n: number): number[] {
  if (n < 2) return [];

  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }

  return primes;
}

// --- Example ---
const limit = 20;
const primes = sieveOfEratosthenes(limit);   // → [2, 3, 5, 7, 11, 13, 17, 19]`,
        steps: [
          {
            lines: [2],
            title: "Handle Edge Case",
            description: "Check if n is less than 2. If so, return empty array since there are no primes less than 2.",
            variables: { n: "input number" }
          },
          {
            lines: [4, 5],
            title: "Initialize Prime Array",
            description: "Create a boolean array where index represents the number. Initially assume all numbers are prime, then mark 0 and 1 as not prime.",
            variables: { "isPrime.length": "n + 1", "isPrime[0]": "false", "isPrime[1]": "false" }
          },
          {
            lines: [7],
            title: "Iterate to Square Root",
            description: "Loop from 2 to sqrt(n). We only need to check up to sqrt(n) because larger factors would have already been eliminated by their smaller counterparts.",
            variables: { i: "2 to sqrt(n)" }
          },
          {
            lines: [8, 9, 10, 11, 12],
            title: "Mark Multiples as Composite",
            description: "If i is prime, mark all its multiples starting from i*i as not prime. Start from i*i because smaller multiples have already been marked by smaller primes.",
            variables: { i: "current prime", j: "i*i, i*i+i, i*i+2i, ..." }
          },
          {
            lines: [15, 16, 17, 18],
            title: "Collect Prime Numbers",
            description: "Iterate through the isPrime array and collect all indices that are still marked as true. These are the prime numbers.",
            variables: { "primes.length": "count of primes found" }
          },
          {
            lines: [20],
            title: "Return Result",
            description: "Return the array containing all prime numbers found up to n.",
            variables: { "return": "array of primes" }
          }
        ]
      },
      {
        language: "python",
        code: `def sieve_of_eratosthenes(n: int) -> list[int]:
    if n < 2:
        return []

    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False

    i = 2
    while i * i <= n:
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
        i += 1

    primes = [i for i in range(2, n + 1) if is_prime[i]]
    return primes

# --- Example ---
limit = 20
primes = sieve_of_eratosthenes(limit)   # -> [2, 3, 5, 7, 11, 13, 17, 19]`,
        steps: [
          {
            lines: [2, 3],
            title: "Handle Edge Case",
            description: "Check if n is less than 2. If so, return empty list since there are no primes less than 2.",
            variables: { n: "input number" }
          },
          {
            lines: [5, 6],
            title: "Initialize Prime Array",
            description: "Create a boolean list where index represents the number. Initially assume all numbers are prime, then mark 0 and 1 as not prime.",
            variables: { "is_prime length": "n + 1", "is_prime[0]": "False", "is_prime[1]": "False" }
          },
          {
            lines: [8, 9],
            title: "Iterate to Square Root",
            description: "Loop from 2 until i*i exceeds n. We only need to check up to sqrt(n) because larger factors would have already been eliminated by their smaller counterparts.",
            variables: { i: "2 to sqrt(n)" }
          },
          {
            lines: [10, 11, 12],
            title: "Mark Multiples as Composite",
            description: "If i is prime, mark all its multiples starting from i*i as not prime using a range with step i. Start from i*i because smaller multiples have already been marked by smaller primes.",
            variables: { i: "current prime", j: "i*i, i*i+i, i*i+2i, ..." }
          },
          {
            lines: [15],
            title: "Collect Prime Numbers",
            description: "Use a list comprehension to collect all indices from 2 to n that are still marked as True in the is_prime array. These are the prime numbers.",
            variables: { "primes length": "count of primes found" }
          },
          {
            lines: [16],
            title: "Return Result",
            description: "Return the list containing all prime numbers found up to n.",
            variables: { "return": "list of primes" }
          }
        ]
      }
    ],
    keyInsights: [
      "Only need to check up to sqrt(n) as larger factors would have been eliminated",
      "Start marking multiples from i*i since smaller multiples already marked",
      "Space-time tradeoff: uses O(n) space for dramatic time improvement",
      "One of the most efficient ways to find all primes up to a limit"
    ],
    whenToUse: [
      "When you need to find all primes up to a specific number",
      "Problems involving prime factorization or prime counting",
      "When precomputing primes for multiple queries"
    ]
  },
  {
    id: "MAT_002",
    name: "GCD (Euclidean Algorithm)",
    category: "Math",
    difficulty: "Beginner",
    timeComplexity: "O(log min(a,b))",
    spaceComplexity: "O(1)",
    complexityScore: 0.2,
    icon: "calculate",
    description: "An efficient algorithm for computing the greatest common divisor of two numbers using the principle that GCD(a,b) = GCD(b, a mod b).",
    longDescription: "The Euclidean Algorithm is one of the oldest algorithms still in common use, dating back to ancient Greece. It computes the greatest common divisor (GCD) of two integers by repeatedly replacing the larger number with the remainder of dividing the larger by the smaller. The process continues until one number becomes zero, at which point the other number is the GCD. This algorithm is remarkably efficient and forms the basis for many number theory applications, including the Extended Euclidean Algorithm used in cryptography.",
    tags: ["number-theory", "recursion", "gcd", "mathematics", "divisibility"],
    leetcodeProblems: ["Greatest Common Divisor of Strings", "Water Bottles"],
    codeExamples: [
      {
        language: "typescript",
        code: `function gcd(a: number, b: number): number {
  // Ensure positive numbers
  a = Math.abs(a);
  b = Math.abs(b);

  // Iterative approach
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

// Recursive approach
function gcdRecursive(a: number, b: number): number {
  if (b === 0) return Math.abs(a);
  return gcdRecursive(b, a % b);
}

// --- Example ---
const result = gcd(48, 18);   // → 6`,
        steps: [
          {
            lines: [3, 4],
            title: "Normalize Inputs",
            description: "Convert both numbers to positive values using absolute value. GCD is always positive and works with absolute values.",
            variables: { a: "Math.abs(a)", b: "Math.abs(b)" }
          },
          {
            lines: [7],
            title: "Check Termination",
            description: "Continue the loop while b is not zero. When b becomes 0, a contains the GCD.",
            variables: { b: "current remainder" }
          },
          {
            lines: [8],
            title: "Save Current b",
            description: "Store the current value of b in a temporary variable before it gets overwritten by the remainder.",
            variables: { temp: "current value of b" }
          },
          {
            lines: [9],
            title: "Calculate Remainder",
            description: "Replace b with the remainder of a divided by b. This is the core of the Euclidean algorithm: GCD(a, b) = GCD(b, a mod b).",
            variables: { b: "a % b" }
          },
          {
            lines: [10],
            title: "Update a",
            description: "Set a to the previous value of b (stored in temp). Now we have effectively replaced (a, b) with (b, a mod b).",
            variables: { a: "previous b" }
          },
          {
            lines: [13],
            title: "Return GCD",
            description: "When b becomes 0, a contains the greatest common divisor of the original inputs.",
            variables: { "return": "GCD value" }
          }
        ]
      },
      {
        language: "python",
        code: `def gcd(a: int, b: int) -> int:
    # Ensure positive numbers
    a, b = abs(a), abs(b)

    # Iterative approach
    while b != 0:
        a, b = b, a % b

    return a

# Recursive approach
def gcd_recursive(a: int, b: int) -> int:
    if b == 0:
        return abs(a)
    return gcd_recursive(b, a % b)

# --- Example ---
result = gcd(48, 18)   # -> 6`,
        steps: [
          {
            lines: [3],
            title: "Normalize Inputs",
            description: "Convert both numbers to positive values using absolute value. GCD is always positive and works with absolute values. Python's tuple unpacking allows simultaneous assignment.",
            variables: { a: "abs(a)", b: "abs(b)" }
          },
          {
            lines: [6],
            title: "Check Termination",
            description: "Continue the loop while b is not zero. When b becomes 0, a contains the GCD.",
            variables: { b: "current remainder" }
          },
          {
            lines: [7],
            title: "Apply Euclidean Step",
            description: "Replace (a, b) with (b, a mod b) using Python's tuple unpacking. This is the core of the Euclidean algorithm: GCD(a, b) = GCD(b, a mod b).",
            variables: { a: "previous b", b: "a % b" }
          },
          {
            lines: [9],
            title: "Return GCD",
            description: "When b becomes 0, a contains the greatest common divisor of the original inputs.",
            variables: { "return": "GCD value" }
          },
          {
            lines: [12, 13, 14, 15],
            title: "Recursive Alternative",
            description: "The recursive approach follows the same logic: base case returns abs(a) when b is 0, otherwise recursively calls with (b, a mod b).",
            variables: { "base case": "b == 0", "recursive": "gcd(b, a % b)" }
          }
        ]
      }
    ],
    keyInsights: [
      "GCD(a, b) = GCD(b, a mod b) is the core principle",
      "The algorithm terminates when remainder becomes 0",
      "Logarithmic time complexity makes it very efficient even for large numbers",
      "Can be extended to compute Bezout coefficients (Extended Euclidean Algorithm)"
    ],
    whenToUse: [
      "Finding the greatest common divisor or least common multiple",
      "Simplifying fractions to lowest terms",
      "Problems involving divisibility, modular arithmetic, or cryptography"
    ]
  },
  {
    id: "MAT_003",
    name: "Fast Exponentiation",
    category: "Math",
    difficulty: "Medium",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    complexityScore: 0.4,
    icon: "superscript",
    description: "An efficient method for computing large powers using binary exponentiation by repeatedly squaring the base.",
    longDescription: "Fast Exponentiation, also known as Exponentiation by Squaring or Binary Exponentiation, computes x^n in logarithmic time instead of linear time. It works by breaking down the exponent into powers of 2 using its binary representation. For example, x^13 = x^8 * x^4 * x^1. By repeatedly squaring the base and selectively multiplying results, we can compute large powers efficiently. This technique is crucial in modular arithmetic, cryptography, and competitive programming where dealing with very large exponents is common.",
    tags: ["exponentiation", "binary", "optimization", "recursion", "modular-arithmetic"],
    leetcodeProblems: ["Pow(x, n)", "Super Pow"],
    codeExamples: [
      {
        language: "typescript",
        code: `function fastPower(base: number, exp: number, mod?: number): number {
  if (exp === 0) return 1;

  let result = 1;
  let x = base;
  let n = exp;

  // Handle negative exponents
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }

  while (n > 0) {
    if (n % 2 === 1) {
      result = mod ? (result * x) % mod : result * x;
    }
    x = mod ? (x * x) % mod : x * x;
    n = Math.floor(n / 2);
  }

  return result;
}

// --- Example ---
const power = fastPower(2, 10);   // → 1024
const modPower = fastPower(3, 5, 7);   // → 5`,
        steps: [
          {
            lines: [2],
            title: "Handle Base Case",
            description: "Any number raised to the power of 0 equals 1. Return immediately for this edge case.",
            variables: { exp: "0", "return": "1" }
          },
          {
            lines: [4, 5, 6],
            title: "Initialize Variables",
            description: "Set up result accumulator (starting at 1), working base (x), and working exponent (n).",
            variables: { result: "1", x: "base", n: "exp" }
          },
          {
            lines: [9, 10, 11],
            title: "Handle Negative Exponent",
            description: "If exponent is negative, invert the base (x = 1/x) and make exponent positive. This converts base^(-n) to (1/base)^n.",
            variables: { x: "1/base if exp < 0", n: "abs(exp)" }
          },
          {
            lines: [14, 15, 16],
            title: "Check Odd Exponent",
            description: "If the current exponent is odd (n % 2 === 1), multiply result by current base value. Apply modulo if provided.",
            variables: { "n % 2": "1 or 0", result: "result * x (mod if provided)" }
          },
          {
            lines: [18],
            title: "Square the Base",
            description: "Square the base value for the next iteration. This is the core of binary exponentiation: x becomes x^2. Apply modulo if provided.",
            variables: { x: "x * x (mod if provided)" }
          },
          {
            lines: [19],
            title: "Halve the Exponent",
            description: "Divide the exponent by 2 (integer division). This processes one bit of the binary representation of the exponent per iteration.",
            variables: { n: "floor(n / 2)" }
          },
          {
            lines: [22],
            title: "Return Result",
            description: "After processing all bits of the exponent, return the accumulated result which equals base^exp.",
            variables: { "return": "base^exp (mod if provided)" }
          }
        ]
      },
      {
        language: "python",
        code: `def fast_power(base: float, exp: int, mod: int = None) -> float:
    if exp == 0:
        return 1

    result = 1
    x = base
    n = exp

    # Handle negative exponents
    if n < 0:
        x = 1 / x
        n = -n

    while n > 0:
        if n % 2 == 1:
            result = (result * x) % mod if mod else result * x
        x = (x * x) % mod if mod else x * x
        n //= 2

    return result

# --- Example ---
power = fast_power(2, 10)   # -> 1024
mod_power = fast_power(3, 5, 7)   # -> 5`,
        steps: [
          {
            lines: [2, 3],
            title: "Handle Base Case",
            description: "Any number raised to the power of 0 equals 1. Return immediately for this edge case.",
            variables: { exp: "0", "return": "1" }
          },
          {
            lines: [5, 6, 7],
            title: "Initialize Variables",
            description: "Set up result accumulator (starting at 1), working base (x), and working exponent (n).",
            variables: { result: "1", x: "base", n: "exp" }
          },
          {
            lines: [10, 11, 12],
            title: "Handle Negative Exponent",
            description: "If exponent is negative, invert the base (x = 1/x) and make exponent positive. This converts base^(-n) to (1/base)^n.",
            variables: { x: "1/base if exp < 0", n: "abs(exp)" }
          },
          {
            lines: [15, 16],
            title: "Check Odd Exponent",
            description: "If the current exponent is odd (n % 2 == 1), multiply result by current base value. Apply modulo if provided using conditional expression.",
            variables: { "n % 2": "1 or 0", result: "result * x (mod if provided)" }
          },
          {
            lines: [17],
            title: "Square the Base",
            description: "Square the base value for the next iteration. This is the core of binary exponentiation: x becomes x^2. Apply modulo if provided.",
            variables: { x: "x * x (mod if provided)" }
          },
          {
            lines: [18],
            title: "Halve the Exponent",
            description: "Divide the exponent by 2 using integer division (//). This processes one bit of the binary representation of the exponent per iteration.",
            variables: { n: "n // 2" }
          },
          {
            lines: [20],
            title: "Return Result",
            description: "After processing all bits of the exponent, return the accumulated result which equals base^exp.",
            variables: { "return": "base^exp (mod if provided)" }
          }
        ]
      }
    ],
    keyInsights: [
      "Uses binary representation of exponent to minimize multiplications",
      "Each iteration squares the base and halves the exponent",
      "Works seamlessly with modular arithmetic for large numbers",
      "Reduces O(n) naive approach to O(log n) time complexity"
    ],
    whenToUse: [
      "Computing large powers efficiently, especially with modular arithmetic",
      "Cryptographic operations requiring modular exponentiation",
      "When dealing with problems involving powers in competitive programming"
    ]
  },

  // String Algorithms
  {
    id: "STR_001",
    name: "KMP Pattern Matching",
    category: "String",
    difficulty: "Advanced",
    timeComplexity: "O(n+m)",
    spaceComplexity: "O(m)",
    complexityScore: 0.75,
    icon: "text_snippet",
    description: "The Knuth-Morris-Pratt algorithm efficiently searches for pattern occurrences in text by avoiding redundant character comparisons using a prefix table.",
    longDescription: "The KMP algorithm, developed by Donald Knuth, James Morris, and Vaughan Pratt, is a linear-time string matching algorithm. Unlike naive approaches that may re-examine characters, KMP preprocesses the pattern to create a Longest Proper Prefix which is also Suffix (LPS) array. This array tells us how many characters to skip when a mismatch occurs, ensuring each character in the text is examined at most once. The preprocessing takes O(m) time where m is the pattern length, and the search takes O(n) time where n is the text length, resulting in overall O(n+m) complexity.",
    tags: ["string-matching", "pattern-search", "lps-array", "preprocessing", "linear-time"],
    leetcodeProblems: ["Find the Index of the First Occurrence in a String", "Shortest Palindrome", "Repeated Substring Pattern"],
    codeExamples: [
      {
        language: "typescript",
        code: `function kmpSearch(text: string, pattern: string): number[] {
  const lps = computeLPS(pattern);
  const matches: number[] = [];
  let i = 0, j = 0;

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }

    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      j !== 0 ? j = lps[j - 1] : i++;
    }
  }
  return matches;
}

function computeLPS(pattern: string): number[] {
  const lps = new Array(pattern.length).fill(0);
  let len = 0, i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else {
      len !== 0 ? len = lps[len - 1] : lps[i++] = 0;
    }
  }
  return lps;
}

// --- Example ---
const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
const matches = kmpSearch(text, pattern);   // → [10]`,
        steps: [
          {
            lines: [2],
            title: "Compute LPS Array",
            description: "Build the Longest Proper Prefix which is also Suffix array for the pattern. This preprocessing step enables efficient pattern matching without backtracking in the text.",
            variables: { "lps.length": "pattern.length" }
          },
          {
            lines: [3, 4],
            title: "Initialize Search Variables",
            description: "Create an array to store match positions. Initialize i (text index) and j (pattern index) to 0.",
            variables: { i: "0 (text pointer)", j: "0 (pattern pointer)" }
          },
          {
            lines: [6, 7, 8, 9],
            title: "Match Characters",
            description: "When characters match, advance both pointers. This moves forward in both the text and pattern simultaneously.",
            variables: { i: "text index", j: "pattern index" }
          },
          {
            lines: [11, 12, 13, 14],
            title: "Record Match",
            description: "When j reaches pattern length, we found a complete match. Record the starting position (i - j) and use LPS to continue searching without restarting.",
            variables: { "matches": "array of start indices", j: "lps[j-1]" }
          },
          {
            lines: [15, 16],
            title: "Handle Mismatch",
            description: "On mismatch, if j > 0, use LPS array to skip ahead in the pattern without backtracking in text. Otherwise, advance text pointer.",
            variables: { j: "lps[j-1] or 0", i: "i or i+1" }
          },
          {
            lines: [19],
            title: "Return Matches",
            description: "Return all starting positions where the pattern was found in the text.",
            variables: { "return": "array of match indices" }
          },
          {
            lines: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
            title: "Build LPS Table",
            description: "The computeLPS helper function builds the failure function table. For each position, it stores the length of the longest proper prefix that is also a suffix.",
            variables: { lps: "prefix-suffix overlap lengths", len: "current prefix length" }
          }
        ]
      },
      {
        language: "python",
        code: `def kmp_search(text: str, pattern: str) -> list[int]:
    lps = compute_lps(pattern)
    matches = []
    i = j = 0

    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1

        if j == len(pattern):
            matches.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and text[i] != pattern[j]:
            j = lps[j - 1] if j != 0 else (i := i + 1, j)[1]

    return matches

def compute_lps(pattern: str) -> list[int]:
    lps = [0] * len(pattern)
    length = 0
    i = 1

    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length != 0:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

# --- Example ---
text = "ABABDABACDABABCABAB"
pattern = "ABABCABAB"
matches = kmp_search(text, pattern)   # -> [10]`,
        steps: [
          {
            lines: [2],
            title: "Compute LPS Array",
            description: "Build the Longest Proper Prefix which is also Suffix array for the pattern. This preprocessing step enables efficient pattern matching without backtracking in the text.",
            variables: { "lps length": "len(pattern)" }
          },
          {
            lines: [3, 4],
            title: "Initialize Search Variables",
            description: "Create a list to store match positions. Initialize i (text index) and j (pattern index) to 0 using chained assignment.",
            variables: { i: "0 (text pointer)", j: "0 (pattern pointer)" }
          },
          {
            lines: [6, 7, 8, 9],
            title: "Match Characters",
            description: "When characters match, advance both pointers. This moves forward in both the text and pattern simultaneously.",
            variables: { i: "text index", j: "pattern index" }
          },
          {
            lines: [11, 12, 13],
            title: "Record Match",
            description: "When j reaches pattern length, we found a complete match. Record the starting position (i - j) and use LPS to continue searching without restarting.",
            variables: { "matches": "list of start indices", j: "lps[j-1]" }
          },
          {
            lines: [14, 15],
            title: "Handle Mismatch",
            description: "On mismatch, if j > 0, use LPS array to skip ahead in the pattern without backtracking in text. Otherwise, advance text pointer using walrus operator.",
            variables: { j: "lps[j-1] or 0", i: "i or i+1" }
          },
          {
            lines: [17],
            title: "Return Matches",
            description: "Return all starting positions where the pattern was found in the text.",
            variables: { "return": "list of match indices" }
          },
          {
            lines: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
            title: "Build LPS Helper",
            description: "The compute_lps helper builds the failure function table. For each position, it stores the length of the longest proper prefix that is also a suffix, handling matches, mismatches, and fallbacks.",
            variables: { lps: "prefix-suffix overlap lengths", length: "current prefix length" }
          }
        ]
      }
    ],
    keyInsights: [
      "LPS array encodes information about pattern's prefix-suffix overlap",
      "Never backtracks in the text, only in the pattern using LPS values",
      "Achieves linear time by avoiding redundant comparisons",
      "The preprocessing step is key to achieving optimal performance"
    ],
    whenToUse: [
      "Finding all occurrences of a pattern in a text efficiently",
      "When the pattern may appear multiple times in the text",
      "Problems requiring substring matching without backtracking"
    ]
  },
  {
    id: "STR_002",
    name: "Rabin-Karp Algorithm",
    category: "String",
    difficulty: "Medium",
    timeComplexity: "O(n+m)",
    spaceComplexity: "O(1)",
    complexityScore: 0.6,
    icon: "tag",
    description: "A string searching algorithm that uses hashing to find pattern matches, using rolling hash for efficient comparison.",
    longDescription: "The Rabin-Karp algorithm uses hashing to search for a pattern in text. It computes a hash value for the pattern and for each substring of text of the same length. By using a rolling hash function, it can update the hash value in constant time when sliding the window. When hash values match, it performs a character-by-character comparison to confirm (avoiding hash collisions). While worst-case is O(nm), average case is O(n+m), making it efficient in practice. It's particularly powerful for searching multiple patterns simultaneously.",
    tags: ["hashing", "rolling-hash", "string-matching", "pattern-search", "rabin-fingerprint"],
    leetcodeProblems: ["Repeated DNA Sequences", "Longest Duplicate Substring"],
    codeExamples: [
      {
        language: "typescript",
        code: `function rabinKarp(text: string, pattern: string): number[] {
  const d = 256; // Number of characters in alphabet
  const q = 101; // A prime number for modulo
  const m = pattern.length;
  const n = text.length;
  const matches: number[] = [];

  let p = 0; // Hash value for pattern
  let t = 0; // Hash value for text
  let h = 1;

  // h = d^(m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  // Calculate initial hash values
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  // Slide pattern over text
  for (let i = 0; i <= n - m; i++) {
    if (p === t && text.substring(i, i + m) === pattern) {
      matches.push(i);
    }

    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t += q;
    }
  }

  return matches;
}

// --- Example ---
const searchText = "ABCABDABCABC";
const searchPattern = "ABC";
const positions = rabinKarp(searchText, searchPattern);   // → [0, 6, 9]`,
        steps: [
          {
            lines: [2, 3, 4, 5, 6],
            title: "Initialize Constants",
            description: "Set up alphabet size (d=256), prime modulo (q=101), pattern length (m), text length (n), and matches array.",
            variables: { d: "256", q: "101", m: "pattern.length", n: "text.length" }
          },
          {
            lines: [8, 9, 10, 12, 13, 14],
            title: "Compute Hash Coefficient",
            description: "Calculate h = d^(m-1) % q, which is used to remove the leading digit when rolling the hash. This is the highest place value in our hash.",
            variables: { h: "d^(m-1) % q" }
          },
          {
            lines: [17, 18, 19, 20],
            title: "Calculate Initial Hashes",
            description: "Compute hash values for the pattern and the first window of text. Use rolling polynomial hash: hash = (d * hash + char) % q.",
            variables: { p: "pattern hash", t: "first window hash" }
          },
          {
            lines: [24, 25, 26],
            title: "Check Hash Match",
            description: "If hashes match, verify with actual string comparison to handle hash collisions. If strings match, record the position.",
            variables: { "p === t": "hash match", "matches": "array of positions" }
          },
          {
            lines: [29, 30],
            title: "Roll Hash Forward",
            description: "Update hash for next window: remove leading character (subtract old_char * h), shift left (multiply by d), add new trailing character. Apply modulo and handle negative values.",
            variables: { t: "hash of next window" }
          },
          {
            lines: [34],
            title: "Return All Matches",
            description: "Return array containing all positions where the pattern was found in the text.",
            variables: { "return": "array of match indices" }
          }
        ]
      },
      {
        language: "python",
        code: `def rabin_karp(text: str, pattern: str) -> list[int]:
    d = 256  # Number of characters in alphabet
    q = 101  # A prime number for modulo
    m = len(pattern)
    n = len(text)
    matches = []

    p = 0  # Hash value for pattern
    t = 0  # Hash value for text
    h = 1

    # h = d^(m-1) % q
    for i in range(m - 1):
        h = (h * d) % q

    # Calculate initial hash values
    for i in range(m):
        p = (d * p + ord(pattern[i])) % q
        t = (d * t + ord(text[i])) % q

    # Slide pattern over text
    for i in range(n - m + 1):
        if p == t and text[i:i + m] == pattern:
            matches.append(i)

        if i < n - m:
            t = (d * (t - ord(text[i]) * h) + ord(text[i + m])) % q
            t = (t + q) % q  # Make sure t is positive

    return matches

# --- Example ---
search_text = "ABCABDABCABC"
search_pattern = "ABC"
positions = rabin_karp(search_text, search_pattern)   # -> [0, 6, 9]`,
        steps: [
          {
            lines: [2, 3, 4, 5, 6],
            title: "Initialize Constants",
            description: "Set up alphabet size (d=256), prime modulo (q=101), pattern length (m), text length (n), and matches list.",
            variables: { d: "256", q: "101", m: "len(pattern)", n: "len(text)" }
          },
          {
            lines: [8, 9, 10, 12, 13, 14],
            title: "Compute Hash Coefficient",
            description: "Calculate h = d^(m-1) % q, which is used to remove the leading digit when rolling the hash. This is the highest place value in our hash.",
            variables: { h: "d^(m-1) % q" }
          },
          {
            lines: [16, 17, 18, 19],
            title: "Calculate Initial Hashes",
            description: "Compute hash values for the pattern and the first window of text using ord() to get character codes. Use rolling polynomial hash: hash = (d * hash + char) % q.",
            variables: { p: "pattern hash", t: "first window hash" }
          },
          {
            lines: [21, 22, 23, 24],
            title: "Check Hash Match",
            description: "If hashes match, verify with actual string slice comparison to handle hash collisions. If strings match, record the position.",
            variables: { "p == t": "hash match", "matches": "list of positions" }
          },
          {
            lines: [26, 27, 28],
            title: "Roll Hash Forward",
            description: "Update hash for next window: remove leading character (subtract ord(text[i]) * h), shift left (multiply by d), add new trailing character. Apply modulo and ensure positive value.",
            variables: { t: "hash of next window" }
          },
          {
            lines: [30],
            title: "Return All Matches",
            description: "Return list containing all positions where the pattern was found in the text.",
            variables: { "return": "list of match indices" }
          }
        ]
      }
    ],
    keyInsights: [
      "Rolling hash allows O(1) hash updates when sliding the window",
      "Hash collisions require verification with actual string comparison",
      "Excellent for searching multiple patterns by storing pattern hashes",
      "Choice of prime modulo affects collision probability"
    ],
    whenToUse: [
      "Searching for multiple patterns in the same text",
      "Plagiarism detection or finding duplicate substrings",
      "When average-case performance is more important than worst-case"
    ]
  },
  {
    id: "STR_003",
    name: "Manacher's Algorithm",
    category: "String",
    difficulty: "Advanced",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.85,
    icon: "format_align_center",
    description: "An elegant linear-time algorithm for finding all palindromic substrings by exploiting palindrome symmetry properties.",
    longDescription: "Manacher's Algorithm finds the longest palindromic substring in linear time, a significant improvement over the O(n^2) naive approach. It preprocesses the string by inserting special characters between every character to handle even-length palindromes uniformly. The algorithm maintains a center and right boundary of the rightmost palindrome found so far, using symmetry properties to avoid redundant comparisons. When expanding around a center, it uses previously computed information from the mirrored position to skip known palindromic regions. This clever use of symmetry makes it one of the most efficient palindrome algorithms.",
    tags: ["palindrome", "string-manipulation", "linear-time", "symmetry", "preprocessing"],
    leetcodeProblems: ["Longest Palindromic Substring", "Palindromic Substrings"],
    codeExamples: [
      {
        language: "typescript",
        code: `function manacher(s: string): string {
  // Preprocess: insert '#' between characters
  const t = '#' + s.split('').join('#') + '#';
  const n = t.length;
  const p = new Array(n).fill(0); // Palindrome radii
  let center = 0, right = 0;
  let maxLen = 0, maxCenter = 0;

  for (let i = 0; i < n; i++) {
    // Mirror of i with respect to center
    const mirror = 2 * center - i;

    // Use previously computed values
    if (i < right) {
      p[i] = Math.min(right - i, p[mirror]);
    }

    // Expand around center i
    while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 &&
           t[i + p[i] + 1] === t[i - p[i] - 1]) {
      p[i]++;
    }

    // Update center and right boundary
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }

    // Track maximum palindrome
    if (p[i] > maxLen) {
      maxLen = p[i];
      maxCenter = i;
    }
  }

  const start = (maxCenter - maxLen) / 2;
  return s.substring(start, start + maxLen);
}

// --- Example ---
const inputString = "babad";
const longestPalindrome = manacher(inputString);   // → "bab" or "aba"`,
        steps: [
          {
            lines: [3, 4, 5],
            title: "Preprocess String",
            description: "Insert '#' between all characters to handle even and odd length palindromes uniformly. Create palindrome radii array to store the radius of palindrome centered at each position.",
            variables: { t: "'#' + chars + '#'", n: "transformed length", "p": "radii array" }
          },
          {
            lines: [6, 7],
            title: "Initialize Tracking Variables",
            description: "Set up variables to track the rightmost palindrome boundary (center, right) and the longest palindrome found (maxLen, maxCenter).",
            variables: { center: "0", right: "0", maxLen: "0", maxCenter: "0" }
          },
          {
            lines: [11, 14, 15, 16],
            title: "Use Symmetry Property",
            description: "Calculate mirror position. If i is within right boundary, use the mirrored position's radius as a starting point, bounded by the distance to right.",
            variables: { mirror: "2*center - i", "p[i]": "min(right-i, p[mirror])" }
          },
          {
            lines: [19, 20, 21],
            title: "Expand Palindrome",
            description: "Attempt to expand the palindrome centered at i by comparing characters on both sides. Continue while characters match and within bounds.",
            variables: { "p[i]": "palindrome radius at i" }
          },
          {
            lines: [24, 25, 26, 27],
            title: "Update Right Boundary",
            description: "If the palindrome centered at i extends beyond the current right boundary, update center and right to track the rightmost palindrome.",
            variables: { center: "i", right: "i + p[i]" }
          },
          {
            lines: [30, 31, 32, 33],
            title: "Track Maximum Palindrome",
            description: "If the current palindrome is longer than the maximum found so far, update maxLen and maxCenter to remember it.",
            variables: { maxLen: "p[i]", maxCenter: "i" }
          },
          {
            lines: [36, 37],
            title: "Extract Result",
            description: "Convert the center and radius back to the original string indices and extract the longest palindromic substring.",
            variables: { start: "(maxCenter-maxLen)/2", "return": "longest palindrome" }
          }
        ]
      },
      {
        language: "python",
        code: `def manacher(s: str) -> str:
    # Preprocess: insert '#' between characters
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    p = [0] * n  # Palindrome radii
    center = right = 0
    max_len = max_center = 0

    for i in range(n):
        # Mirror of i with respect to center
        mirror = 2 * center - i

        # Use previously computed values
        if i < right:
            p[i] = min(right - i, p[mirror])

        # Expand around center i
        while (i + p[i] + 1 < n and i - p[i] - 1 >= 0 and
               t[i + p[i] + 1] == t[i - p[i] - 1]):
            p[i] += 1

        # Update center and right boundary
        if i + p[i] > right:
            center = i
            right = i + p[i]

        # Track maximum palindrome
        if p[i] > max_len:
            max_len = p[i]
            max_center = i

    start = (max_center - max_len) // 2
    return s[start:start + max_len]

# --- Example ---
input_string = "babad"
longest_palindrome = manacher(input_string)   # -> "bab" or "aba"`,
        steps: [
          {
            lines: [3, 4, 5],
            title: "Preprocess String",
            description: "Insert '#' between all characters using join() to handle even and odd length palindromes uniformly. Create palindrome radii list to store the radius of palindrome centered at each position.",
            variables: { t: "'#' + chars + '#'", n: "transformed length", p: "radii list" }
          },
          {
            lines: [6, 7],
            title: "Initialize Tracking Variables",
            description: "Set up variables to track the rightmost palindrome boundary (center, right) and the longest palindrome found (max_len, max_center) using chained assignment.",
            variables: { center: "0", right: "0", max_len: "0", max_center: "0" }
          },
          {
            lines: [11, 14, 15],
            title: "Use Symmetry Property",
            description: "Calculate mirror position. If i is within right boundary, use the mirrored position's radius as a starting point, bounded by the distance to right.",
            variables: { mirror: "2*center - i", "p[i]": "min(right-i, p[mirror])" }
          },
          {
            lines: [17, 18, 19, 20],
            title: "Expand Palindrome",
            description: "Attempt to expand the palindrome centered at i by comparing characters on both sides. Continue while characters match and within bounds using a multi-line while condition.",
            variables: { "p[i]": "palindrome radius at i" }
          },
          {
            lines: [22, 23, 24, 25],
            title: "Update Right Boundary",
            description: "If the palindrome centered at i extends beyond the current right boundary, update center and right to track the rightmost palindrome.",
            variables: { center: "i", right: "i + p[i]" }
          },
          {
            lines: [27, 28, 29, 30],
            title: "Track Maximum Palindrome",
            description: "If the current palindrome is longer than the maximum found so far, update max_len and max_center to remember it.",
            variables: { max_len: "p[i]", max_center: "i" }
          },
          {
            lines: [32, 33],
            title: "Extract Result",
            description: "Convert the center and radius back to the original string indices using integer division and extract the longest palindromic substring using slice notation.",
            variables: { start: "(max_center-max_len)//2", "return": "longest palindrome" }
          }
        ]
      }
    ],
    keyInsights: [
      "Preprocessing with separators handles even/odd length palindromes uniformly",
      "Uses symmetry property: if palindrome centered at C contains i, mirror position has same radius",
      "Maintains rightmost boundary to reuse computed information",
      "Each character is visited at most twice, ensuring linear time"
    ],
    whenToUse: [
      "Finding the longest palindromic substring efficiently",
      "Counting all palindromic substrings in linear time",
      "When O(n^2) palindrome checking is too slow"
    ]
  },

  // Union Find Algorithms
  {
    id: "UNI_001",
    name: "Union-Find with Path Compression",
    category: "Union Find",
    difficulty: "Medium",
    timeComplexity: "O(alpha(n))",
    spaceComplexity: "O(n)",
    complexityScore: 0.55,
    icon: "device_hub",
    description: "A disjoint-set data structure with path compression and union by rank optimizations for near-constant time operations.",
    longDescription: "Union-Find (also called Disjoint Set Union) efficiently manages a partition of elements into disjoint sets with two main operations: find (determine which set an element belongs to) and union (merge two sets). Path compression flattens the tree structure during find operations by making nodes point directly to the root. Union by rank attaches the shorter tree under the taller one during union operations. Together, these optimizations achieve nearly constant amortized time complexity of O(alpha(n)), where alpha is the inverse Ackermann function, which grows extremely slowly and is effectively constant for all practical purposes.",
    tags: ["disjoint-set", "path-compression", "union-by-rank", "graph-connectivity", "data-structure"],
    leetcodeProblems: ["Number of Provinces", "Redundant Connection", "Accounts Merge"],
    codeExamples: [
      {
        language: "typescript",
        code: `class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      // Path compression
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

// --- Example ---
const uf = new UnionFind(5);
uf.union(0, 1);   // → true
uf.union(1, 2);   // → true
const areConnected = uf.connected(0, 2);   // → true`,
        steps: [
          {
            lines: [5, 6, 7],
            title: "Initialize Disjoint Sets",
            description: "Create parent array where each element initially points to itself (each element is its own root). Initialize rank array to track tree heights for balanced unions.",
            variables: { "parent[i]": "i (self)", "rank[i]": "0" }
          },
          {
            lines: [10, 11, 12, 13, 14, 15],
            title: "Find with Path Compression",
            description: "Recursively find the root of element x. During recursion, apply path compression by making each node point directly to the root, flattening the tree structure.",
            variables: { "parent[x]": "root after compression" }
          },
          {
            lines: [18, 19, 20, 22],
            title: "Find Roots of Both Elements",
            description: "Find the root representatives of both x and y. If they have the same root, they're already in the same set, so return false.",
            variables: { rootX: "root of x", rootY: "root of y" }
          },
          {
            lines: [25, 26, 27, 28],
            title: "Union by Rank",
            description: "Attach the tree with smaller rank under the tree with larger rank. This keeps trees balanced and prevents degeneration into linked lists.",
            variables: { "parent": "updated parent pointers" }
          },
          {
            lines: [29, 30, 31],
            title: "Handle Equal Ranks",
            description: "When ranks are equal, arbitrarily choose one as parent and increment its rank since the tree height increases by 1.",
            variables: { "rank[rootX]": "rank[rootX] + 1" }
          },
          {
            lines: [33],
            title: "Confirm Union Success",
            description: "Return true to indicate that the union operation successfully merged two previously separate sets.",
            variables: { "return": "true" }
          },
          {
            lines: [36, 37, 38],
            title: "Check Connectivity",
            description: "The connected method checks if two elements belong to the same set by comparing their root representatives.",
            variables: { "return": "find(x) === find(y)" }
          }
        ]
      },
      {
        language: "python",
        code: `class UnionFind:
    def __init__(self, size: int):
        self.parent = list(range(size))
        self.rank = [0] * size

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            # Path compression
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False

        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

    def connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)

# --- Example ---
uf = UnionFind(5)
uf.union(0, 1)   # -> True
uf.union(1, 2)   # -> True
are_connected = uf.connected(0, 2)   # -> True`,
        steps: [
          {
            lines: [2, 3, 4],
            title: "Initialize Disjoint Sets",
            description: "Create parent list where each element initially points to itself (each element is its own root) using list(range(size)). Initialize rank list to track tree heights for balanced unions.",
            variables: { "parent[i]": "i (self)", "rank[i]": "0" }
          },
          {
            lines: [6, 7, 8, 9, 10],
            title: "Find with Path Compression",
            description: "Recursively find the root of element x. During recursion, apply path compression by making each node point directly to the root, flattening the tree structure.",
            variables: { "parent[x]": "root after compression" }
          },
          {
            lines: [12, 13, 14, 16, 17],
            title: "Find Roots of Both Elements",
            description: "Find the root representatives of both x and y. If they have the same root, they're already in the same set, so return False.",
            variables: { root_x: "root of x", root_y: "root of y" }
          },
          {
            lines: [19, 20, 21, 22, 23, 24],
            title: "Union by Rank",
            description: "Attach the tree with smaller rank under the tree with larger rank. This keeps trees balanced and prevents degeneration into linked lists.",
            variables: { parent: "updated parent pointers" }
          },
          {
            lines: [25, 26, 27],
            title: "Handle Equal Ranks",
            description: "When ranks are equal, arbitrarily choose one as parent and increment its rank since the tree height increases by 1.",
            variables: { "rank[root_x]": "rank[root_x] + 1" }
          },
          {
            lines: [28],
            title: "Confirm Union Success",
            description: "Return True to indicate that the union operation successfully merged two previously separate sets.",
            variables: { "return": "True" }
          },
          {
            lines: [30, 31],
            title: "Check Connectivity",
            description: "The connected method checks if two elements belong to the same set by comparing their root representatives.",
            variables: { "return": "find(x) == find(y)" }
          }
        ]
      }
    ],
    keyInsights: [
      "Path compression makes subsequent finds faster by flattening tree structure",
      "Union by rank keeps trees balanced, preventing degeneration into linked lists",
      "Nearly constant time operations make it extremely efficient for large datasets",
      "Perfect for dynamic connectivity problems and detecting cycles"
    ],
    whenToUse: [
      "Determining connected components in a graph",
      "Detecting cycles in undirected graphs",
      "Implementing Kruskal's minimum spanning tree algorithm"
    ]
  },
  {
    id: "UNI_002",
    name: "Number of Connected Components",
    category: "Union Find",
    difficulty: "Medium",
    timeComplexity: "O(n*alpha(n))",
    spaceComplexity: "O(n)",
    complexityScore: 0.5,
    icon: "scatter_plot",
    description: "Uses Union-Find to efficiently count the number of connected components in an undirected graph.",
    longDescription: "This algorithm leverages the Union-Find data structure to count connected components in an undirected graph. Starting with n isolated components (one per vertex), it processes each edge and unions the components of the connected vertices. Each successful union reduces the component count by one. The final count represents the number of disconnected subgraphs. This approach is more efficient than DFS/BFS for this specific problem because Union-Find provides near-constant time operations with path compression and union by rank optimizations.",
    tags: ["graph-components", "union-find", "connectivity", "graph-theory", "disjoint-sets"],
    leetcodeProblems: ["Number of Connected Components in an Undirected Graph", "Graph Valid Tree"],
    codeExamples: [
      {
        language: "typescript",
        code: `function countComponents(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  let components = n;

  function find(x: number): number {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x: number, y: number): boolean {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) return false;

    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      parent[rootY] = rootX;
      rank[rootX]++;
    }
    return true;
  }

  for (const [u, v] of edges) {
    if (union(u, v)) {
      components--;
    }
  }

  return components;
}

// --- Example ---
const n = 5;
const edges = [[0, 1], [1, 2], [3, 4]];
const numComponents = countComponents(n, edges);   // → 2`,
        steps: [
          {
            lines: [2, 3, 4],
            title: "Initialize Union-Find",
            description: "Create parent and rank arrays for Union-Find. Start with n components, one for each isolated vertex.",
            variables: { "parent[i]": "i", "rank[i]": "0", components: "n" }
          },
          {
            lines: [6, 7, 8, 9, 10, 11],
            title: "Define Find Operation",
            description: "Implement find function with path compression. Recursively finds the root representative and flattens the tree structure.",
            variables: { "parent[x]": "root of x's set" }
          },
          {
            lines: [13, 14, 15, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
            title: "Define Union Operation",
            description: "Implement union function with rank optimization. Merges two sets by attaching the smaller rank tree under the larger one. Returns false if already in same set.",
            variables: { rootX: "root of x", rootY: "root of y" }
          },
          {
            lines: [30, 31, 32, 33],
            title: "Process Each Edge",
            description: "For each edge in the graph, attempt to union the two vertices. If the union is successful (they were in different components), decrement the component count.",
            variables: { u: "first vertex", v: "second vertex", components: "decrements on successful union" }
          },
          {
            lines: [35],
            title: "Return Component Count",
            description: "After processing all edges, return the final count of connected components in the graph.",
            variables: { "return": "number of components" }
          }
        ]
      },
      {
        language: "python",
        code: `def count_components(n: int, edges: list[list[int]]) -> int:
    parent = list(range(n))
    rank = [0] * n
    components = n

    def find(x: int) -> int:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x: int, y: int) -> bool:
        root_x = find(x)
        root_y = find(y)

        if root_x == root_y:
            return False

        if rank[root_x] < rank[root_y]:
            parent[root_x] = root_y
        elif rank[root_x] > rank[root_y]:
            parent[root_y] = root_x
        else:
            parent[root_y] = root_x
            rank[root_x] += 1
        return True

    for u, v in edges:
        if union(u, v):
            components -= 1

    return components

# --- Example ---
n = 5
edges = [[0, 1], [1, 2], [3, 4]]
num_components = count_components(n, edges)   # -> 2`,
        steps: [
          {
            lines: [2, 3, 4],
            title: "Initialize Union-Find",
            description: "Create parent and rank lists for Union-Find. Start with n components, one for each isolated vertex.",
            variables: { "parent[i]": "i", "rank[i]": "0", components: "n" }
          },
          {
            lines: [6, 7, 8, 9],
            title: "Define Find Operation",
            description: "Implement find function with path compression. Recursively finds the root representative and flattens the tree structure.",
            variables: { "parent[x]": "root of x's set" }
          },
          {
            lines: [11, 12, 13, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25],
            title: "Define Union Operation",
            description: "Implement union function with rank optimization. Merges two sets by attaching the smaller rank tree under the larger one. Returns False if already in same set.",
            variables: { root_x: "root of x", root_y: "root of y" }
          },
          {
            lines: [27, 28, 29],
            title: "Process Each Edge",
            description: "For each edge in the graph, attempt to union the two vertices using tuple unpacking. If the union is successful (they were in different components), decrement the component count.",
            variables: { u: "first vertex", v: "second vertex", components: "decrements on successful union" }
          },
          {
            lines: [31],
            title: "Return Component Count",
            description: "After processing all edges, return the final count of connected components in the graph.",
            variables: { "return": "number of components" }
          }
        ]
      }
    ],
    keyInsights: [
      "Start with n components and decrement on each successful union",
      "Union-Find naturally tracks component membership through parent pointers",
      "More efficient than DFS/BFS when only counting components",
      "Can also detect if graph is a valid tree (components == 1 and edges == n-1)"
    ],
    whenToUse: [
      "Counting connected components in undirected graphs",
      "Validating if a graph forms a tree",
      "Problems involving dynamic connectivity queries"
    ]
  },

  // Trie Algorithms
  {
    id: "TRI_001",
    name: "Implement Trie",
    category: "Trie",
    difficulty: "Medium",
    timeComplexity: "O(m)",
    spaceComplexity: "O(n*m)",
    complexityScore: 0.55,
    icon: "schema",
    description: "A tree-based data structure for efficient storage and retrieval of strings, supporting prefix-based operations.",
    longDescription: "A Trie (prefix tree) is a specialized tree data structure used for storing and searching strings efficiently. Each node represents a character, and paths from root to nodes form strings. The key advantage is that common prefixes are stored only once, making it space-efficient for large datasets with shared prefixes. Operations like insert, search, and prefix matching all run in O(m) time where m is the length of the word, independent of the number of words stored. This makes tries excellent for autocomplete, spell checking, and IP routing.",
    tags: ["prefix-tree", "string-storage", "autocomplete", "dictionary", "tree-structure"],
    leetcodeProblems: ["Implement Trie (Prefix Tree)", "Design Add and Search Words Data Structure"],
    codeExamples: [
      {
        language: "typescript",
        code: `class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return true;
  }
}

// --- Example ---
const trie = new Trie();
trie.insert("apple");
const found = trie.search("apple");   // → true
const hasPrefix = trie.startsWith("app");   // → true`,
        steps: [
          {
            lines: [1, 2, 3, 5, 6, 7, 8],
            title: "Define TrieNode Structure",
            description: "Create the TrieNode class with a Map to store children nodes and a boolean flag to mark complete words. Each node represents one character position in the tree.",
            variables: { "children": "Map of char to TrieNode", isEndOfWord: "false" }
          },
          {
            lines: [11, 12, 14, 15, 16],
            title: "Initialize Trie",
            description: "Create the Trie class with a root node. The root represents an empty string and serves as the entry point for all operations.",
            variables: { root: "new TrieNode()" }
          },
          {
            lines: [18, 19, 20, 21, 22, 23, 24, 25, 26],
            title: "Insert Word",
            description: "Traverse the trie character by character. Create new nodes for characters that don't exist. Mark the final node as end of word.",
            variables: { node: "current position", char: "current character" }
          },
          {
            lines: [28, 29, 30, 31, 32, 33, 34],
            title: "Search for Word",
            description: "Traverse the trie following the word's characters. Return false if any character path doesn't exist. Return true only if we reach a node marked as end of word.",
            variables: { node: "current position", "return": "isEndOfWord at final node" }
          },
          {
            lines: [36, 37, 38, 39, 40, 41, 42, 43],
            title: "Check Prefix",
            description: "Similar to search, but only checks if the prefix path exists in the trie. Returns true if all characters in the prefix can be followed, regardless of end-of-word marker.",
            variables: { node: "current position", "return": "true if path exists" }
          }
        ]
      },
      {
        language: "python",
        code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

# --- Example ---
trie = Trie()
trie.insert("apple")
found = trie.search("apple")   # -> True
has_prefix = trie.starts_with("app")   # -> True`,
        steps: [
          {
            lines: [1, 2, 3, 4],
            title: "Define TrieNode Structure",
            description: "Create the TrieNode class with a dictionary to store children nodes and a boolean flag to mark complete words. Each node represents one character position in the tree.",
            variables: { "children": "dict of char to TrieNode", is_end_of_word: "False" }
          },
          {
            lines: [6, 7, 8],
            title: "Initialize Trie",
            description: "Create the Trie class with a root node. The root represents an empty string and serves as the entry point for all operations.",
            variables: { root: "TrieNode()" }
          },
          {
            lines: [10, 11, 12, 13, 14, 15, 16],
            title: "Insert Word",
            description: "Traverse the trie character by character. Create new nodes for characters that don't exist using dictionary membership test. Mark the final node as end of word.",
            variables: { node: "current position", char: "current character" }
          },
          {
            lines: [18, 19, 20, 21, 22, 23, 24],
            title: "Search for Word",
            description: "Traverse the trie following the word's characters. Return False if any character path doesn't exist. Return True only if we reach a node marked as end of word.",
            variables: { node: "current position", "return": "is_end_of_word at final node" }
          },
          {
            lines: [26, 27, 28, 29, 30, 31, 32],
            title: "Check Prefix",
            description: "Similar to search, but only checks if the prefix path exists in the trie. Returns True if all characters in the prefix can be followed, regardless of end-of-word marker.",
            variables: { node: "current position", "return": "True if path exists" }
          }
        ]
      }
    ],
    keyInsights: [
      "Time complexity depends only on word length, not dictionary size",
      "Common prefixes are stored once, saving space for related words",
      "Each node can have up to 26 children for lowercase English letters",
      "Boolean flag at nodes marks complete words vs intermediate prefixes"
    ],
    whenToUse: [
      "Implementing autocomplete or typeahead features",
      "Spell checking and word validation",
      "Prefix-based searches and IP routing tables"
    ]
  },
  {
    id: "TRI_002",
    name: "Word Search II",
    category: "Trie",
    difficulty: "Advanced",
    timeComplexity: "O(m*n*4^l)",
    spaceComplexity: "O(n*l)",
    complexityScore: 0.8,
    icon: "find_in_page",
    description: "Combines Trie with DFS backtracking to efficiently find all words from a dictionary on a 2D board.",
    longDescription: "This advanced algorithm solves the problem of finding all dictionary words that can be formed by sequentially adjacent cells on a 2D character board. It builds a Trie from the dictionary words, then performs DFS from each cell while traversing the Trie simultaneously. This approach is far more efficient than searching for each word individually because the Trie allows early termination when a path doesn't match any word prefix. The algorithm backtracks through the board while pruning branches that don't exist in the Trie, combining the power of both data structures for optimal performance.",
    tags: ["trie", "backtracking", "dfs", "2d-grid", "word-search"],
    leetcodeProblems: ["Word Search II", "Word Search"],
    codeExamples: [
      {
        language: "typescript",
        code: `function findWords(board: string[][], words: string[]): string[] {
  const root = buildTrie(words);
  const result: string[] = [];
  const m = board.length, n = board[0].length;

  function dfs(i: number, j: number, node: TrieNode, path: string) {
    if (i < 0 || i >= m || j < 0 || j >= n) return;

    const char = board[i][j];
    if (char === '#' || !node.children.has(char)) return;

    const next = node.children.get(char)!;
    const newPath = path + char;

    if (next.isEndOfWord) {
      result.push(newPath);
      next.isEndOfWord = false; // Avoid duplicates
    }

    board[i][j] = '#'; // Mark visited
    dfs(i + 1, j, next, newPath);
    dfs(i - 1, j, next, newPath);
    dfs(i, j + 1, next, newPath);
    dfs(i, j - 1, next, newPath);
    board[i][j] = char; // Restore
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      dfs(i, j, root, '');
    }
  }
  return result;
}

function buildTrie(words: string[]): TrieNode {
  const root = new TrieNode();
  for (const word of words) {
    let node = root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }
  return root;
}

// --- Example ---
const board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]];
const words = ["oath","pea","eat","rain"];
const foundWords = findWords(board, words);   // → ["oath","eat"]`,
        steps: [
          {
            lines: [2, 3, 4],
            title: "Build Trie and Initialize",
            description: "Build a trie from all dictionary words for efficient prefix matching. Initialize result array and get board dimensions.",
            variables: { root: "trie root", result: "[]", m: "rows", n: "cols" }
          },
          {
            lines: [7, 9, 10],
            title: "Validate Position and Character",
            description: "Check if current position is within bounds. Return early if out of bounds, already visited ('#'), or character not in trie.",
            variables: { i: "row", j: "col", char: "board[i][j]" }
          },
          {
            lines: [12, 13, 15, 16, 17, 18],
            title: "Check for Word Match",
            description: "Move to next trie node and build path. If current node marks end of word, add to results and mark as found to avoid duplicates.",
            variables: { next: "next trie node", newPath: "path + char" }
          },
          {
            lines: [20, 21, 22, 23, 24, 25],
            title: "Backtrack in 4 Directions",
            description: "Mark current cell as visited ('#'). Recursively explore all 4 adjacent cells (up, down, left, right). Restore cell value after backtracking.",
            variables: { "board[i][j]": "'#' then restored" }
          },
          {
            lines: [27, 28, 29, 30, 31, 32],
            title: "Search from Each Cell",
            description: "Start DFS search from every cell in the board. Each cell could be the starting point of a valid word in the dictionary.",
            variables: { i: "row index", j: "col index" }
          },
          {
            lines: [33],
            title: "Return Found Words",
            description: "After exploring all starting positions, return the list of all dictionary words found on the board.",
            variables: { "return": "array of found words" }
          },
          {
            lines: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
            title: "Build Trie Helper",
            description: "The buildTrie helper constructs a trie from the word list. Each word is inserted character by character, with the final node marked as end of word.",
            variables: { root: "trie root", node: "current position" }
          }
        ]
      },
      {
        language: "python",
        code: `def find_words(board: list[list[str]], words: list[str]) -> list[str]:
    root = build_trie(words)
    result = []
    m, n = len(board), len(board[0])

    def dfs(i: int, j: int, node: TrieNode, path: str):
        if i < 0 or i >= m or j < 0 or j >= n:
            return

        char = board[i][j]
        if char == '#' or char not in node.children:
            return

        next_node = node.children[char]
        new_path = path + char

        if next_node.is_end_of_word:
            result.append(new_path)
            next_node.is_end_of_word = False  # Avoid duplicates

        board[i][j] = '#'  # Mark visited
        for di, dj in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            dfs(i + di, j + dj, next_node, new_path)
        board[i][j] = char  # Restore

    for i in range(m):
        for j in range(n):
            dfs(i, j, root, '')

    return result

def build_trie(words: list[str]) -> TrieNode:
    root = TrieNode()
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
    return root

# --- Example ---
board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
words = ["oath","pea","eat","rain"]
found_words = find_words(board, words)   # -> ["oath","eat"]`,
        steps: [
          {
            lines: [2, 3, 4],
            title: "Build Trie and Initialize",
            description: "Build a trie from all dictionary words for efficient prefix matching. Initialize result list and get board dimensions using tuple unpacking.",
            variables: { root: "trie root", result: "[]", m: "rows", n: "cols" }
          },
          {
            lines: [7, 8, 10, 11, 12],
            title: "Validate Position and Character",
            description: "Check if current position is within bounds. Return early if out of bounds, already visited ('#'), or character not in trie.",
            variables: { i: "row", j: "col", char: "board[i][j]" }
          },
          {
            lines: [14, 15, 17, 18, 19],
            title: "Check for Word Match",
            description: "Move to next trie node and build path. If current node marks end of word, add to results and mark as found to avoid duplicates.",
            variables: { next_node: "next trie node", new_path: "path + char" }
          },
          {
            lines: [21, 22, 23, 24],
            title: "Backtrack in 4 Directions",
            description: "Mark current cell as visited ('#'). Use a list of direction tuples to recursively explore all 4 adjacent cells (up, down, left, right). Restore cell value after backtracking.",
            variables: { "board[i][j]": "'#' then restored" }
          },
          {
            lines: [26, 27, 28],
            title: "Search from Each Cell",
            description: "Start DFS search from every cell in the board using nested loops. Each cell could be the starting point of a valid word in the dictionary.",
            variables: { i: "row index", j: "col index" }
          },
          {
            lines: [30],
            title: "Return Found Words",
            description: "After exploring all starting positions, return the list of all dictionary words found on the board.",
            variables: { "return": "list of found words" }
          },
          {
            lines: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
            title: "Build Trie Helper",
            description: "The build_trie helper constructs a trie from the word list. Each word is inserted character by character, with the final node marked as end of word.",
            variables: { root: "trie root", node: "current position" }
          }
        ]
      }
    ],
    keyInsights: [
      "Trie enables early termination when path doesn't match any word prefix",
      "DFS backtracking explores all possible paths from each starting position",
      "Marking cells visited prevents revisiting in the same path",
      "Much more efficient than searching each word individually"
    ],
    whenToUse: [
      "Finding multiple words in a 2D grid or board",
      "Boggle game solver implementations",
      "When you need to search for many patterns simultaneously"
    ]
  },

  // Divide & Conquer Algorithms
  {
    id: "DAC_001",
    name: "Merge Sort (D&C)",
    category: "Divide & Conquer",
    difficulty: "Medium",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.55,
    icon: "call_split",
    description: "A classic divide-and-conquer sorting algorithm that recursively divides the array and merges sorted halves.",
    longDescription: "Merge Sort is a quintessential divide-and-conquer algorithm that sorts an array by recursively dividing it into two halves until single elements remain, then merging them back in sorted order. The divide step splits the array at the midpoint, and the conquer step merges two sorted subarrays into one. Unlike quicksort, merge sort guarantees O(n log n) time complexity in all cases, making it stable and predictable. The tradeoff is O(n) extra space for the merge operation. It's particularly effective for linked lists where the space overhead is negligible.",
    tags: ["divide-and-conquer", "sorting", "stable-sort", "recursion", "merging"],
    leetcodeProblems: ["Sort an Array", "Count of Smaller Numbers After Self", "Reverse Pairs"],
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
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

// --- Example ---
const unsorted = [38, 27, 43, 3, 9, 82, 10];
const sorted = mergeSort(unsorted);   // → [3, 9, 10, 27, 38, 43, 82]`,
        steps: [
          {
            lines: [2],
            title: "Base Case Check",
            description: "If array has 1 or 0 elements, it's already sorted. Return it immediately without further recursion.",
            variables: { "arr.length": "0 or 1", "return": "arr" }
          },
          {
            lines: [4],
            title: "Find Midpoint",
            description: "Calculate the middle index to divide the array into two roughly equal halves. This is the 'divide' step of divide-and-conquer.",
            variables: { mid: "floor(arr.length / 2)" }
          },
          {
            lines: [5, 6],
            title: "Recursively Sort Halves",
            description: "Recursively sort the left half (from 0 to mid) and right half (from mid to end). These recursive calls will continue dividing until base case is reached.",
            variables: { left: "sorted left half", right: "sorted right half" }
          },
          {
            lines: [8],
            title: "Merge Sorted Halves",
            description: "Call the merge function to combine the two sorted halves into a single sorted array. This is the 'conquer' step.",
            variables: { "return": "merged sorted array" }
          },
          {
            lines: [12, 13, 15, 16, 17, 18, 19, 20],
            title: "Merge Two Sorted Arrays",
            description: "Compare elements from left and right arrays. Always take the smaller element and add it to result. This maintains sorted order.",
            variables: { i: "left index", j: "right index", result: "merged array" }
          },
          {
            lines: [23, 24],
            title: "Copy Remaining Elements",
            description: "After one array is exhausted, copy all remaining elements from the other array. These are already in sorted order.",
            variables: { result: "complete sorted array" }
          },
          {
            lines: [26],
            title: "Return Merged Result",
            description: "Return the fully merged and sorted array combining both input arrays.",
            variables: { "return": "sorted merged array" }
          }
        ]
      },
      {
        language: "python",
        code: `def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
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

# --- Example ---
unsorted = [38, 27, 43, 3, 9, 82, 10]
sorted_arr = merge_sort(unsorted)   # -> [3, 9, 10, 27, 38, 43, 82]`,
        steps: [
          {
            lines: [2, 3],
            title: "Base Case Check",
            description: "If list has 1 or 0 elements, it's already sorted. Return it immediately without further recursion.",
            variables: { "len(arr)": "0 or 1", "return": "arr" }
          },
          {
            lines: [5],
            title: "Find Midpoint",
            description: "Calculate the middle index using integer division to divide the list into two roughly equal halves. This is the 'divide' step of divide-and-conquer.",
            variables: { mid: "len(arr) // 2" }
          },
          {
            lines: [6, 7],
            title: "Recursively Sort Halves",
            description: "Recursively sort the left half (from 0 to mid) and right half (from mid to end) using slice notation. These recursive calls will continue dividing until base case is reached.",
            variables: { left: "sorted left half", right: "sorted right half" }
          },
          {
            lines: [9],
            title: "Merge Sorted Halves",
            description: "Call the merge function to combine the two sorted halves into a single sorted list. This is the 'conquer' step.",
            variables: { "return": "merged sorted list" }
          },
          {
            lines: [12, 13, 15, 16, 17, 18, 19, 20, 21],
            title: "Merge Two Sorted Lists",
            description: "Compare elements from left and right lists using chained assignment for indices. Always take the smaller element and add it to result. This maintains sorted order.",
            variables: { i: "left index", j: "right index", result: "merged list" }
          },
          {
            lines: [23, 24],
            title: "Copy Remaining Elements",
            description: "After one list is exhausted, use extend() with slice notation to copy all remaining elements from the other list. These are already in sorted order.",
            variables: { result: "complete sorted list" }
          },
          {
            lines: [26],
            title: "Return Merged Result",
            description: "Return the fully merged and sorted list combining both input lists.",
            variables: { "return": "sorted merged list" }
          }
        ]
      }
    ],
    keyInsights: [
      "Guarantees O(n log n) performance in all cases unlike quicksort",
      "Stable sorting algorithm preserves relative order of equal elements",
      "Recursion depth is log n, each level processes n elements",
      "Can be optimized with in-place merging to reduce space complexity"
    ],
    whenToUse: [
      "When stable sorting is required",
      "Sorting linked lists efficiently",
      "When guaranteed O(n log n) worst-case performance is needed"
    ]
  },
  {
    id: "DAC_002",
    name: "Closest Pair of Points",
    category: "Divide & Conquer",
    difficulty: "Advanced",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    complexityScore: 0.75,
    icon: "place",
    description: "Finds the minimum distance between any two points in 2D space using divide-and-conquer with optimal strip checking.",
    longDescription: "This sophisticated algorithm finds the closest pair of points among n points in a 2D plane in O(n log n) time. It divides the points by x-coordinate, recursively finds the closest pairs in each half, then checks for closer pairs that span the dividing line. The key optimization is that only points within a strip of width 2*delta (where delta is the minimum distance from recursive calls) need checking, and geometric properties limit comparisons to 7 points per point. The algorithm presorts by both x and y coordinates to achieve the optimal time complexity.",
    tags: ["divide-and-conquer", "geometry", "closest-pair", "2d-points", "optimization"],
    leetcodeProblems: ["K Closest Points to Origin", "Closest Pair of Points"],
    codeExamples: [
      {
        language: "typescript",
        code: `interface Point {
  x: number;
  y: number;
}

function closestPair(points: Point[]): number {
  const pX = [...points].sort((a, b) => a.x - b.x);
  const pY = [...points].sort((a, b) => a.y - b.y);
  return closestPairRec(pX, pY);
}

function closestPairRec(pX: Point[], pY: Point[]): number {
  if (pX.length <= 3) return bruteForce(pX);

  const mid = Math.floor(pX.length / 2);
  const midPoint = pX[mid];

  const pYLeft = pY.filter(p => p.x <= midPoint.x);
  const pYRight = pY.filter(p => p.x > midPoint.x);

  const dLeft = closestPairRec(pX.slice(0, mid), pYLeft);
  const dRight = closestPairRec(pX.slice(mid), pYRight);
  const d = Math.min(dLeft, dRight);

  const strip = pY.filter(p => Math.abs(p.x - midPoint.x) < d);
  return Math.min(d, stripClosest(strip, d));
}

function stripClosest(strip: Point[], d: number): number {
  let min = d;
  for (let i = 0; i < strip.length; i++) {
    for (let j = i + 1; j < strip.length && strip[j].y - strip[i].y < min; j++) {
      min = Math.min(min, distance(strip[i], strip[j]));
    }
  }
  return min;
}

function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function bruteForce(points: Point[]): number {
  let min = Infinity;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      min = Math.min(min, distance(points[i], points[j]));
    }
  }
  return min;
}

// --- Example ---
const points = [{x: 2, y: 3}, {x: 12, y: 30}, {x: 40, y: 50}, {x: 5, y: 1}, {x: 12, y: 10}, {x: 3, y: 4}];
const minDistance = closestPair(points);   // → 1.414 (between (2,3) and (3,4))`,
        steps: [
          {
            lines: [7, 8, 9],
            title: "Presort Points",
            description: "Sort all points by x-coordinate (pX) and y-coordinate (pY). This preprocessing enables efficient divide-and-conquer by allowing O(n) splitting in recursive calls.",
            variables: { pX: "sorted by x", pY: "sorted by y" }
          },
          {
            lines: [13],
            title: "Base Case - Brute Force",
            description: "For 3 or fewer points, use brute force O(1) comparison. This is the recursion base case and is efficient for small sets.",
            variables: { "pX.length": "≤ 3" }
          },
          {
            lines: [15, 16, 18, 19],
            title: "Divide Points by X",
            description: "Find midpoint and split points into left and right halves based on x-coordinate. Maintain y-sorted order for both halves.",
            variables: { mid: "midpoint index", pYLeft: "left half y-sorted", pYRight: "right half y-sorted" }
          },
          {
            lines: [21, 22, 23],
            title: "Recursively Find Minimum",
            description: "Recursively find the closest pair distance in left half and right half. Take the minimum of these two distances.",
            variables: { dLeft: "min distance in left", dRight: "min distance in right", d: "min(dLeft, dRight)" }
          },
          {
            lines: [25, 26],
            title: "Check Strip for Closer Pairs",
            description: "Create a strip of points within distance d from the dividing line. Check this strip for pairs that span both halves and might be closer than d.",
            variables: { strip: "points within d of midline", "return": "min(d, stripClosest)" }
          },
          {
            lines: [29, 30, 31, 32, 33, 34, 35, 36],
            title: "Strip Closest Helper",
            description: "For points in the strip (sorted by y), only check points within d vertical distance. Geometric properties guarantee we only need to check at most 7 points per point.",
            variables: { min: "minimum distance found", i: "current point", j: "comparison point" }
          },
          {
            lines: [39, 40, 44, 45, 46, 47, 48, 49, 50],
            title: "Distance and Brute Force Helpers",
            description: "Helper functions: distance computes Euclidean distance between two points. bruteForce checks all pairs for small point sets.",
            variables: { distance: "sqrt((x1-x2)² + (y1-y2)²)", bruteForce: "O(n²) for n ≤ 3" }
          }
        ]
      },
      {
        language: "python",
        code: `from typing import List, Tuple
import math

class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

def closest_pair(points: List[Point]) -> float:
    p_x = sorted(points, key=lambda p: p.x)
    p_y = sorted(points, key=lambda p: p.y)
    return closest_pair_rec(p_x, p_y)

def closest_pair_rec(p_x: List[Point], p_y: List[Point]) -> float:
    if len(p_x) <= 3:
        return brute_force(p_x)

    mid = len(p_x) // 2
    mid_point = p_x[mid]

    p_y_left = [p for p in p_y if p.x <= mid_point.x]
    p_y_right = [p for p in p_y if p.x > mid_point.x]

    d_left = closest_pair_rec(p_x[:mid], p_y_left)
    d_right = closest_pair_rec(p_x[mid:], p_y_right)
    d = min(d_left, d_right)

    strip = [p for p in p_y if abs(p.x - mid_point.x) < d]
    return min(d, strip_closest(strip, d))

def strip_closest(strip: List[Point], d: float) -> float:
    min_dist = d
    for i in range(len(strip)):
        j = i + 1
        while j < len(strip) and strip[j].y - strip[i].y < min_dist:
            min_dist = min(min_dist, distance(strip[i], strip[j]))
            j += 1
    return min_dist

def distance(p1: Point, p2: Point) -> float:
    return math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)

def brute_force(points: List[Point]) -> float:
    min_dist = float('inf')
    for i in range(len(points)):
        for j in range(i + 1, len(points)):
            min_dist = min(min_dist, distance(points[i], points[j]))
    return min_dist

# --- Example ---
points = [Point(2, 3), Point(12, 30), Point(40, 50), Point(5, 1), Point(12, 10), Point(3, 4)]
min_distance = closest_pair(points)   # -> 1.414 (between (2,3) and (3,4))`,
        steps: [
          {
            lines: [10, 11, 12],
            title: "Presort Points",
            description: "Sort all points by x-coordinate (p_x) and y-coordinate (p_y) using lambda functions. This preprocessing enables efficient divide-and-conquer by allowing O(n) splitting in recursive calls.",
            variables: { p_x: "sorted by x", p_y: "sorted by y" }
          },
          {
            lines: [15, 16],
            title: "Base Case - Brute Force",
            description: "For 3 or fewer points, use brute force O(1) comparison. This is the recursion base case and is efficient for small sets.",
            variables: { "len(p_x)": "≤ 3" }
          },
          {
            lines: [18, 19, 21, 22],
            title: "Divide Points by X",
            description: "Find midpoint and split points into left and right halves based on x-coordinate using list comprehensions. Maintain y-sorted order for both halves.",
            variables: { mid: "midpoint index", p_y_left: "left half y-sorted", p_y_right: "right half y-sorted" }
          },
          {
            lines: [24, 25, 26],
            title: "Recursively Find Minimum",
            description: "Recursively find the closest pair distance in left half and right half. Take the minimum of these two distances.",
            variables: { d_left: "min distance in left", d_right: "min distance in right", d: "min(d_left, d_right)" }
          },
          {
            lines: [28, 29],
            title: "Check Strip for Closer Pairs",
            description: "Create a strip of points within distance d from the dividing line using list comprehension with abs(). Check this strip for pairs that span both halves and might be closer than d.",
            variables: { strip: "points within d of midline", "return": "min(d, strip_closest)" }
          },
          {
            lines: [31, 32, 33, 34, 35, 36, 37, 38],
            title: "Strip Closest Helper",
            description: "For points in the strip (sorted by y), only check points within d vertical distance using a while loop. Geometric properties guarantee we only need to check at most 7 points per point.",
            variables: { min_dist: "minimum distance found", i: "current point", j: "comparison point" }
          },
          {
            lines: [40, 41, 43, 44, 45, 46, 47, 48],
            title: "Distance and Brute Force Helpers",
            description: "Helper functions: distance computes Euclidean distance using math.sqrt and exponentiation. brute_force checks all pairs for small point sets using nested loops and float('inf').",
            variables: { distance: "sqrt((x1-x2)² + (y1-y2)²)", brute_force: "O(n²) for n ≤ 3" }
          }
        ]
      }
    ],
    keyInsights: [
      "Presorting by both coordinates enables efficient recursive splitting",
      "Strip checking only needs to examine at most 7 points per point",
      "Combines divide-and-conquer with geometric properties for optimization",
      "Base case uses brute force for small sets (3 or fewer points)"
    ],
    whenToUse: [
      "Finding closest pair among many points in 2D space",
      "Computational geometry problems requiring distance minimization",
      "When brute force O(n^2) approach is too slow for large datasets"
    ]
  }
];
