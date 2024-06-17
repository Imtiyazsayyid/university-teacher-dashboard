export function humanize(key) {
  if (!key) return "";

  // Replace underscores with spaces
  let humanizedKey = key.replace(/_/g, " ");

  // Capitalize the first letter of each word
  humanizedKey = humanizedKey.replace(/\b\w/g, (char) => char.toUpperCase());

  return humanizedKey;
}

export function breakLines(text, Container) {
  if (!text) return "";

  return text.split("\n").map((line) => (
    <Container className="text-center" key={line}>
      {line}
    </Container>
  ));
}

export function abbreviate(text) {
  let abbr = "";

  if (!text) return "";

  let textArray = text.split(" ");

  if (textArray.length === 0) return "?";

  for (let word of textArray) {
    abbr += word.charAt(0);
  }

  return abbr;
}

export function changeNullToZero(obj) {
  for (let key in obj) {
    if (obj[key] === null) {
      obj[key] = 0;
    }
  }

  return obj;
}
