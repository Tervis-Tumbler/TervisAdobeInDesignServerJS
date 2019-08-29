import {
    New_NumberRange
} from '../TervisUtilityJS/TervisUtilityJS.js'

export async function Invoke_InDesignServerRunScriptDirectlyWithInlineSOAP ({
    $InDesignServerInstance,
    $ScriptText
}) {
    //https://stackoverflow.com/questions/1132494/string-escape-into-xml
    var $Body = `
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
        <RunScript xmlns="http://ns.adobe.com/InDesign/soap/">
            <runScriptParameters xmlns="">
                <scriptText>${escapeXml($ScriptText)}</scriptText>
                <scriptLanguage>javascript</scriptLanguage>
                <scriptFile xsi:nil="true" />
            </runScriptParameters>
        </RunScript>
    </soap:Body>
</soap:Envelope>
`

    var $Result = await got(
        `http://${$InDesignServerInstance.$ComputerName}:${$InDesignServerInstance.$Port}/`,
        {
            method: "POST",
            headers: {
                SOAPAction: "",
                "Content-Type": "text/xml; charset=utf-8"
            },
            retry: 0,
            body: $Body
        }
    )
}

//https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

export function Select_InDesignServerInstance ({
    $InDesignServerInstances = Get_InDesignServerInstance(),
    $SelectionMethod, //[ValidateSet("Lock","Random","Port")]
    $Port
}) {
    if ($SelectionMethod === "Random") {
        let $RandomIndex = Math.random() * $InDesignServerInstances.length | 0
        return $InDesignServerInstances[$RandomIndex]
    }
}

function Get_InDesignServerInstance () {
    return $InDesignServerInstances
}

let $InDesignServerInstances = New_NumberRange({$Size: 20, $StartAt: 8080}).map($Port => {
    return New_InDesignServerInstance({ $ComputerName: "INF-InDesign02", $Port })
})

function New_InDesignServerInstance({
    $ComputerName,
    $Port
}) {
    return {$ComputerName,$Port}
}