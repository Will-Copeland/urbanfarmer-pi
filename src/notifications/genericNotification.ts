import request from "request-promise";

export default (body: string, icon?: string) => {
    return request("https://hooks.zapier.com/hooks/catch/6342019/ottwc35/", {
        body: JSON.stringify({
            body,
            icon,
        }),
        method: "POST",
    });
};
