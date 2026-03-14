import { Cpu, HardDrive } from "lucide-react";

export const CPU_GUIDE = [
  {
    name: "First Come First Served (FCFS)",
    subtitle: "Non-preemptive, queue-based scheduling",
    type: "CPU",
    icon: Cpu,
    color: "bg-primary/20 text-primary",
    explanation:
      "FCFS is the simplest CPU scheduling algorithm. Processes are executed in the order they arrive in the ready queue. The CPU is allocated to the first process in the queue, and it runs to completion before the next process begins.",
    principle:
      "Uses a FIFO (First In, First Out) queue. When a process arrives, it is placed at the end of the queue. The CPU executes processes sequentially from the front of the queue. No process can preempt another.",
    complexity: "O(n)",
    advantages: [
      "Simple to understand and implement",
      "No starvation — every process gets executed",
      "Fair ordering based on arrival time",
      "Minimal overhead due to no context switching decisions",
    ],
    disadvantages: [
      "Convoy effect — short processes wait behind long ones",
      "High average waiting time for varied burst times",
      "Not suitable for interactive or time-sharing systems",
      "Non-preemptive — cannot respond to high-priority arrivals",
    ],
    realWorld:
      "Used in batch processing systems, print job queues, and simple embedded systems where process order matters more than response time.",
  },
  {
    name: "Round Robin (RR)",
    subtitle: "Preemptive, time-quantum based",
    type: "CPU",
    icon: Cpu,
    color: "bg-accent/20 text-accent",
    explanation:
      "Round Robin assigns a fixed time quantum to each process. The CPU cycles through all processes in the ready queue, giving each one a turn for the duration of the time quantum. If a process doesn't finish, it's moved to the back of the queue.",
    principle:
      "Maintains a circular queue. Each process gets a maximum of q time units (time quantum). After q units, the process is preempted and placed at the end of the queue. The scheduler picks the next process from the front.",
    complexity: "O(n × total_burst / quantum)",
    advantages: [
      "Fair allocation of CPU time to all processes",
      "Good response time for interactive systems",
      "No starvation",
      "Simple to implement with a circular queue",
    ],
    disadvantages: [
      "Performance depends heavily on quantum size",
      "Too small quantum causes excessive context switching",
      "Too large quantum degrades to FCFS behavior",
      "Higher average turnaround time than SJN for similar loads",
    ],
    realWorld:
      "Standard in modern time-sharing and multitasking operating systems like Linux (CFS is RR-inspired), Windows task scheduler, and real-time systems.",
  },
  {
    name: "Shortest Job Next (SJN)",
    subtitle: "Non-preemptive, burst-time optimized",
    type: "CPU",
    icon: Cpu,
    color: "bg-chart-3/20 text-chart-3",
    explanation:
      "SJN (also called SJF - Shortest Job First) selects the process with the smallest burst time from the ready queue. This minimizes the average waiting time for a given set of processes.",
    principle:
      "At each scheduling point, the algorithm scans all processes in the ready queue and selects the one with the shortest CPU burst. The selected process runs to completion (non-preemptive). Requires knowledge or estimation of burst times.",
    complexity: "O(n²)",
    advantages: [
      "Optimal average waiting time among non-preemptive algorithms",
      "Efficient for batch systems with known burst times",
      "Reduces overall process completion time",
    ],
    disadvantages: [
      "Requires knowing burst times in advance (not always possible)",
      "Can cause starvation of longer processes",
      "Not suitable for interactive systems",
      "Difficult to implement accurately without burst time prediction",
    ],
    realWorld:
      "Used in batch processing environments, job schedulers in HPC clusters, and as a theoretical benchmark for evaluating other algorithms.",
  },
  {
    name: "Shortest Remaining Time Next (SRTN)",
    subtitle: "Preemptive version of SJN",
    type: "CPU",
    icon: Cpu,
    color: "bg-chart-4/20 text-chart-4",
    explanation:
      "SRTN is the preemptive version of SJN. At any point, if a new process arrives with a shorter remaining burst time than the currently running process, the CPU preempts the current process and switches to the new one.",
    principle:
      "Continuously monitors the remaining burst time of all ready processes. Whenever a new process arrives, the scheduler compares its burst time with the remaining time of the running process. If the new process is shorter, preemption occurs.",
    complexity: "O(n²)",
    advantages: [
      "Optimal average waiting time (theoretically optimal)",
      "Better response time than non-preemptive SJN",
      "Highly efficient for mixed workloads",
    ],
    disadvantages: [
      "Requires accurate burst time prediction",
      "High context switching overhead",
      "Can cause starvation of long processes",
      "Complex to implement",
    ],
    realWorld:
      "Used as a theoretical optimal benchmark. Some modern schedulers like Linux CFS use similar concepts with virtual runtime tracking.",
  },
  {
    name: "Priority Scheduling",
    subtitle: "Priority-based with preemptive/non-preemptive modes",
    type: "CPU",
    icon: Cpu,
    color: "bg-chart-5/20 text-chart-5",
    explanation:
      "Each process is assigned a priority number. The CPU is allocated to the process with the highest priority (lowest number = highest priority). Can be preemptive (new high-priority processes can interrupt) or non-preemptive.",
    principle:
      "Processes are stored in a priority queue. The scheduler always picks the highest-priority process. In preemptive mode, if a newly arrived process has higher priority than the running one, preemption occurs. Aging can be used to prevent starvation.",
    complexity: "O(n²)",
    advantages: [
      "Supports process importance differentiation",
      "Critical processes get faster service",
      "Flexible — can combine with other strategies",
      "Well-suited for real-time systems",
    ],
    disadvantages: [
      "Can cause starvation of low-priority processes",
      "Priority inversion problems",
      "Requires careful priority assignment",
      "More complex to implement and manage",
    ],
    realWorld:
      "Used in real-time operating systems (RTOS), Windows priority scheduling, network packet scheduling (QoS), and hospital triage systems.",
  },
];

export const DISK_GUIDE = [
  {
    name: "FCFS (First Come First Served)",
    subtitle: "Simple queue-based disk scheduling",
    type: "Disk",
    icon: HardDrive,
    color: "bg-primary/20 text-primary",
    explanation:
      "Disk FCFS processes I/O requests in the order they arrive. The disk arm moves to each requested cylinder sequentially without any optimization for distance.",
    principle:
      "Maintains a simple FIFO queue of disk requests. The disk head moves to each requested position in arrival order, regardless of how far it needs to travel. No reordering or optimization.",
    complexity: "O(n)",
    advantages: [
      "Simplest to implement",
      "No starvation",
      "Fair ordering",
      "Predictable behavior",
    ],
    disadvantages: [
      "High total head movement",
      "Poor performance with scattered requests",
      "No optimization for seek time",
      "Wildly varying seek times",
    ],
    realWorld:
      "Used in simple embedded storage controllers and as a baseline comparison for more advanced algorithms.",
  },
  {
    name: "SCAN (Elevator Algorithm)",
    subtitle: "Bi-directional sweep scheduling",
    type: "Disk",
    icon: HardDrive,
    color: "bg-accent/20 text-accent",
    explanation:
      "The disk arm moves in one direction servicing requests, then reverses and services requests in the other direction. Like an elevator moving up and down.",
    principle:
      "The head starts moving in one direction (typically toward higher cylinders). It services all requests in its path until it reaches the end of the disk, then reverses direction and services remaining requests.",
    complexity: "O(n log n)",
    advantages: [
      "More uniform wait times than FCFS",
      "Better throughput than FCFS",
      "No starvation",
      "Predictable scan pattern",
    ],
    disadvantages: [
      "Uneven wait times — requests at edges wait longer",
      "Always travels to disk end, even if no requests",
      "Middle cylinders get favored",
    ],
    realWorld:
      "Standard in many disk controllers. Used in hard drive firmware, elevator control systems, and database I/O optimization.",
  },
  {
    name: "C-SCAN (Circular SCAN)",
    subtitle: "Unidirectional sweep scheduling",
    type: "Disk",
    icon: HardDrive,
    color: "bg-chart-3/20 text-chart-3",
    explanation:
      "C-SCAN moves the head in one direction, servicing requests. When it reaches the end, it jumps back to the beginning without servicing, then continues in the same direction.",
    principle:
      "Services requests only while moving in one direction. Upon reaching the end of the disk, the head quickly returns to the start (without servicing) and continues. This provides more uniform wait times than SCAN.",
    complexity: "O(n log n)",
    advantages: [
      "More uniform wait times than SCAN",
      "Treats all cylinders equally",
      "No starvation",
      "Better for systems needing fairness",
    ],
    disadvantages: [
      "Return trip wastes time without servicing",
      "Slightly higher total head movement than SCAN",
      "More complex to implement",
    ],
    realWorld:
      "Used in enterprise storage systems, RAID controllers, and database servers requiring fair I/O distribution.",
  },
  {
    name: "LOOK",
    subtitle: "Optimized SCAN — reverses at last request",
    type: "Disk",
    icon: HardDrive,
    color: "bg-chart-4/20 text-chart-4",
    explanation:
      "LOOK is similar to SCAN but the head only goes as far as the last request in each direction before reversing, rather than going all the way to the disk end.",
    principle:
      'The head "looks" ahead before moving. It moves in one direction servicing requests, but reverses as soon as there are no more requests in the current direction, rather than going to the physical end of the disk.',
    complexity: "O(n log n)",
    advantages: [
      "Less total head movement than SCAN",
      "No unnecessary travel to disk edges",
      "Good balance of performance and fairness",
    ],
    disadvantages: [
      "Slightly more complex than SCAN",
      "Still has uneven wait times at boundaries",
      "Middle cylinders may still be favored",
    ],
    realWorld:
      "Default algorithm in many modern operating system I/O schedulers. Used in Linux BFQ and CFQ schedulers.",
  },
  {
    name: "C-LOOK",
    subtitle: "Optimized C-SCAN — reverses at last request",
    type: "Disk",
    icon: HardDrive,
    color: "bg-chart-5/20 text-chart-5",
    explanation:
      "C-LOOK combines the benefits of C-SCAN and LOOK. It moves in one direction up to the last request, then jumps back to the lowest pending request and continues.",
    principle:
      "Like C-SCAN but doesn't go to the physical ends of the disk. After servicing the highest request, it jumps to the lowest pending request and resumes. This minimizes unnecessary head movement while maintaining fairness.",
    complexity: "O(n log n)",
    advantages: [
      "Minimal unnecessary head movement",
      "Uniform wait times",
      "Best combination of efficiency and fairness",
      "No travel to disk edges",
    ],
    disadvantages: [
      "Most complex of the disk algorithms",
      "Jump back still adds some overhead",
      "Slightly less predictable than C-SCAN",
    ],
    realWorld:
      "Used in modern Linux I/O schedulers, SSD controllers, and enterprise storage systems for optimal I/O performance.",
  },
];
