
export async function save(arg) {
    try {
        await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(arg)

        })
    } catch (e) {
        console.log(e)
    }
}

