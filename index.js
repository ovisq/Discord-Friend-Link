const fetch = require("node-fetch");
const yaml = require("js-yaml");
const fs = require("fs");

async function getFriendLink(token) {
    try {
        const response = await fetch(`https://discord.com/api/v9/users/@me/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 0,
                max_uses: 0,
                temporary: false
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36"
            },
        });

        if (response.ok) {
            console.log(`SUCCESS\t\tGot Friend Link`);
            const responseBody = await response.json(); // Await the JSON parsing
            console.log(`RESPONSE\tOutput from request: ${response.status}`);
            return responseBody.code;
        } else {
            console.error(`ERROR\t\tGetting Friend Link: HTTP ${response.status}`);
        }
    } catch (error) {
        console.error("ERROR\t\t" + error.message);
        return null; // Return null to indicate an error
    }

    return null;
}

async function main(token) {
    const friendLink = await getFriendLink(token);

    if (friendLink) {
        try {
            fs.writeFileSync("friendLink.txt", `https://discord.gg/${friendLink}`);
            console.log("SUCCESS\t\tCreated friend link output file.");
        } catch (error) {
            console.error(`ERROR\t\tCould not create file for output: ${error.message}`);
        }
    } else {
        console.log("NOTIFICATION\tFriend Link Output file will not be created.")
    }
}

(async () => {
    try {
		const yamlData = fs.readFileSync("./token.yaml");
		const settings = yaml.load(yamlData);
        if (settings.token.length !== 0) {
            console.log("TOKEN\t\tYour set token is", settings.token)
		    await main(settings.token);
        } else {
            console.error("ERROR\t\tPlease fill out the token before running");
        }
	} catch (error) {
		console.error(`ERROR\t\tloading token.yaml: ${error.message}`);
	}
})();