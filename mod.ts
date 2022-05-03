const encoder = new TextEncoder();
const decoder = new TextDecoder();

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
  console.assert(success, decoder.decode(rawError.subarray(0, -1)));
  return decoder.decode(rawOutput.subarray(0, -1));
}
