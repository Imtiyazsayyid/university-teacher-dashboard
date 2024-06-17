export default function yearRange(start: number, end: number) {
  let years = [];
  for (let i = start; i <= end; i++) {
    years.push({ label: i, value: i });
  }

  return years;
}
