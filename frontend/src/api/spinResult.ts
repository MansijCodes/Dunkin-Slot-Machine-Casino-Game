export async function spinResult(
  playerId: number,
  lines: number,
  freeSpin: boolean = false
) {
  try {
    const result = await fetch(`http://localhost:8080/spin/${playerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lines: lines, freeSpin }),
    });
    if (!result) {
      throw new Error('Network response was not ok');
    }
    return result.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}
