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
  const { status, stderr, stdout } = await Deno.spawn("plink", {
    args: [`${username}@${host}`, "-pw", password, command],
    inp: encoder.encode("echo y"),
  });
  console.assert(status.success, decoder.decode(stderr));
  return decoder.decode(stdout);
}
