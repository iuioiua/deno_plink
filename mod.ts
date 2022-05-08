const encoder = new TextEncoder();
const decoder = new TextDecoder();

function parse(input: Uint8Array): string {
  return decoder.decode(input.subarray(0, -1));
}

export interface PlinkInit {
  host: string;
  username: string;
  password: string;
  command: string;
}

export async function plink(
  { host, username, password, command }: PlinkInit,
): Promise<string> {
  const cmd = [
    "plink",
    `${username}@${host}`,
    "-pw",
    password,
    command,
  ];
  const process = Deno.run({
    cmd,
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  await process.stdin.write(encoder.encode("echo y"));
  process.stdin.close();
  const [{ success }, rawOutput, rawError] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ]);
  process.close();
  console.assert(success, parse(rawError));
  return parse(rawOutput);
}
