const util = require("util");
const {
    exec
} = require("child_process");

module.exports = {
    before: async (m, {
        conn,
        isOwner
    }) => {
        if (m.text.startsWith('=>')) {
            if (!isOwner) return;
            let {
                key
            } = await conn.sendMessage(m.chat, {
                text: "evaling..."
            }, {
                quoted: m
            });
            try {
                const result = await eval(`(async () => { return ${m.text.slice(3)} })()`);
                await conn.sendMessage(m.chat, {
                    text: util.format(result),
                    edit: key
                });
            } catch (e) {
                await conn.sendMessage(m.chat, {
                    text: util.format(e),
                    edit: key
                });
            }
        }

        if (m.text.startsWith('>')) {
            if (!isOwner) return;
            let {
                key
            } = await conn.sendMessage(m.chat, {
                text: "evaling..."
            }, {
                quoted: m
            });
            try {
                const result = await eval(m.text.slice(2));
                await conn.sendMessage(m.chat, {
                    text: util.inspect(result),
                    edit: key
                });
            } catch (e) {
                await conn.sendMessage(m.chat, {
                    text: util.format(e),
                    edit: key
                });
            }
        }

        if (m.text.startsWith('$')) {
            if (!isOwner) return;
            let {
                key
            } = await conn.sendMessage(m.chat, {
                text: "executed..."
            }, {
                quoted: m
            });
            exec(m.text.slice(2), async (err, stdout) => {
                if (err) return await conn.sendMessage(m.chat, {
                    text: err,
                    edit: key
                });
                if (stdout) return await conn.sendMessage(m.chat, {
                    text: stdout,
                    edit: key
                });
            });
        }
    },
};