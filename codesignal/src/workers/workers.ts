// --- Level 1
// Worker class: id, position, compensation, working?, totalHours
// System class: Map<string, Worker>
// --- Level 2: no design changes
// --- Level 3:
// Add nextPosition, nextCompensation, promoteAt to Worker and apply promotion upon next entry if promtedAt is past
// Add new Type: Salary: earnedAt, amount
// Worker should have a earnings: Salary[]

class Salary {
  public compensation: number;
  public startAt: number;
  public endAt: number;

  constructor(compensation: number, startAt: number, endAt: number) {
    this.compensation = compensation;
    this.startAt = startAt;
    this.endAt = endAt;
  }

  public getOverlap(rangeStart: number, rangeEnd: number): number {
    if (this.startAt > rangeEnd || this.endAt < rangeStart) {
      return 0;
    }

    const overlapStart = Math.max(this.startAt, rangeStart);
    const overlapEnd = Math.min(this.endAt, rangeEnd);
    return overlapEnd - overlapStart;
  }
}


class WorkerData {
  public id: string;
  public position: string;
  public compensation: number;
  public timeWorked: number;
  public currentPosTime: number;
  public enteredAt: number | null = null;

  public nextPosition: string | null = null;
  public nextCompensation: number | null = null;
  public promoteAt: number | null = null;

  public earnings: Salary[] = []

  constructor(id: string, position: string, compensation: string) {
    this.id = id;
    this.position = position;
    this.compensation = parseInt(compensation);
    this.timeWorked = 0;
    this.currentPosTime = 0;
  }
}

class System {
  public workers: Map<string, WorkerData> = new Map();

  constructor() {}

  public addWorker(workerId: string, position: string, compensation: string): "true" | "false" {
    if (this.workers.has(workerId)) {
      return "false";
    }
    this.workers.set(workerId, new WorkerData(workerId, position, compensation))
    return "true";
  }

  public register(workerId: string, timestamp: string): "invalid_request" | "registered" {
    const worker = this.workers.get(workerId);
    if (!worker) {
      return "invalid_request";
    }

    if (worker.enteredAt) {
      const time = parseInt(timestamp) - worker.enteredAt;
      worker.earnings.push(new Salary(worker.compensation, worker.enteredAt, parseInt(timestamp)));
      worker.timeWorked += time;
      worker.currentPosTime += time;
      worker.enteredAt = null;
    } else {
      worker.enteredAt = parseInt(timestamp);
      if (worker.nextCompensation && worker.nextPosition && worker.promoteAt && worker.promoteAt <= parseInt(timestamp)) {
        worker.position = worker.nextPosition;
        worker.compensation = worker.nextCompensation;
        worker.nextCompensation = null;
        worker.nextPosition = null;
        worker.promoteAt = null;
        worker.currentPosTime = 0;
      }
    }

    return "registered";
  }

  public get(workerId: string): string {
    return this.workers.get(workerId)?.timeWorked.toString() || "";
  }

  public topNWorkers(n: string, position: string): string {
    return Array.from(this.workers.values())
      .filter(w => w.position === position)
      .sort((a, b) => (b.timeWorked - a.timeWorked) || a.id.localeCompare(b.id))
      .slice(0, parseInt(n))
      .map(w => `${w.id}(${w.currentPosTime})`)
      .join(", ");
  }

  public promote(workerId: string, newPosition: string, newCompensation: string, startTimestamp: string): "invalid_request" | "success" {
    const worker = this.workers.get(workerId);

    if (!worker || worker.nextPosition) {
      return "invalid_request";
    }

    worker.nextPosition = newPosition;
    worker.nextCompensation = parseInt(newCompensation);
    worker.promoteAt = parseInt(startTimestamp);

    return "success";
  }

  public calcSalary(workerId: string, startTimestamp: string, endTimestamp: string): string {
    const worker = this.workers.get(workerId);
    if (!worker) {
      return "";
    }

    const startAt = parseInt(startTimestamp);
    const endAt = parseInt(endTimestamp);

    return worker.earnings
      .reduce((acc, e) => e.getOverlap(startAt, endAt) * e.compensation + acc, 0).toString();
  }
}

function test(id: number, value: any, expected: any) {
  if (JSON.stringify(value) === JSON.stringify(expected)) {
    console.log(`Test ${id} passed`);
  }
  else {
    console.log(`Test ${id} failed! expected "${expected}" got "${value}"`);
  }
}


console.log("Level 1 Tests:");
const sys1 = new System();
test(1, sys1.addWorker("Ashley", "Middle Developer", "150"), "true");
test(2, sys1.addWorker("Ashley", "Junior Developer", "100"), "false");
test(3, sys1.register("Ashley", "10"), "registered");
test(4, sys1.register("Ashley", "25"), "registered");
test(5, sys1.get("Ashley"), "15");
test(6, sys1.register("Ashley", "40"), "registered");
test(7, sys1.register("Ashley", "67"), "registered");
test(8, sys1.register("Ashley", "100"), "registered");
test(9, sys1.get("Ashley"), "42");
test(10, sys1.get("Walter"), "");
test(11, sys1.register("Walter", "120"), "invalid_request");

console.log("\nLevel 2 Tests:");
const sys2 = new System();
test(12, sys2.addWorker("John", "Junior Developer", "120"), "true");
test(13, sys2.addWorker("Jason", "Junior Developer", "120"), "true");
test(14, sys2.addWorker("Ashley", "Junior Developer", "120"), "true");
test(15, sys2.register("John", "100"), "registered");
test(16, sys2.register("John", "150"), "registered");
test(17, sys2.register("Jason", "200"), "registered");
test(18, sys2.register("Jason", "250"), "registered");
test(19, sys2.register("Jason", "275"), "registered");
test(20, sys2.topNWorkers("5", "Junior Developer"), "Jason(50), John(50), Ashley(0)");
test(21, sys2.topNWorkers("1", "Junior Developer"), "Jason(50)");
test(22, sys2.register("Ashley", "400"), "registered");
test(23, sys2.register("Ashley", "500"), "registered");
test(24, sys2.register("Jason", "575"), "registered");
test(25, sys2.topNWorkers("3", "Junior Developer"), "Jason(350), Ashley(100), John(50)");
test(26, sys2.topNWorkers("3", "Middle Developer"), "");


console.log("\nLevel 3 Tests:");
const sys3 = new System();
test(27, sys3.addWorker("John", "Middle Developer", "200"), "true");
test(28, sys3.register("John", "100"), "registered")
test(29, sys3.register("John", "125"), "registered");
test(30, sys3.promote("John", "Senior Developer", "500", "200"), "success");
test(31, sys3.register("John", "150"), "registered")
test(32, sys3.promote("John", "Senior Developer", "350", "250"), "invalid_request");
test(33, sys3.register("John", "300"), "registered");
test(34, sys3.register("John", "325"), "registered");
test(35, sys3.calcSalary("John", "0", "500"), "35000");
test(36, sys3.topNWorkers("3", "Senior Developer"), "John(0)");
test(37, sys3.register("John", "400"), "registered");
test(38, sys3.get("John"), "250");
test(39, sys3.topNWorkers("10", "Senior Developer"), "John(75)");
test(40, sys3.topNWorkers("10", "Middle Developer"), "");
test(41, sys3.calcSalary("John", "110", "350"), "45500");
test(42, sys3.calcSalary("John", "900", "1400"), "0");

