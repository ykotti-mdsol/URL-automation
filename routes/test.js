const express = require('express');
const router = express.Router();
// const { exec } = require('child_process');
const axios = require("axios");
const { exec } = require('shelljs');
const config = process.env


// router.post("/new", async (req, res) => {


// const username = 'ssawant';
// const password = 'Sidhoji100@';
// console.log("Inside test")

// const ps = new PowerShell({
//   executionPolicy: 'Bypass',
//   noProfile: true,
//   debugMsg: false,
// });

// try {
//   // Construct the PowerShell commands
//   const connectCommand = `$securePassword = ConvertTo-SecureString -String '${password}' -AsPlainText -Force; $credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList ('${username}', $securePassword); $session = New-PSSession -ComputerName 'hdc505lbwtsv004' -Credential $credential`;
// //   const invokeCommand = `
// //     Invoke-Command -Session $session -ScriptBlock {
// //       param($app, $version, $url, $template)
// //       & 'path/to/deployment-script.ps1' -App $app -Version $version -Url $url -Template $template
// //     } -ArgumentList '${app}', '${version}', '${url}', '${template}'
// //   `;
// const invokeCommand = `
//   Invoke-Command -Session $session -ScriptBlock {
//     $username = whoami
//     $username
//   }
// `;

//   const removeSessionCommand = 'Remove-PSSession -Session $session';

//   // Execute the PowerShell commands
//   await ps.addCommand(connectCommand);
//   await ps.addCommand(invokeCommand);
//   const output = await ps.invoke();
//   await ps.addCommand(removeSessionCommand);
//   await ps.invoke();

//   console.log(`PowerShell Output: ${output}`);
//   return res.send(output);
// } catch (err) {
//   console.error(`PowerShell Error: ${err}`);
//   return res.status(500).send('An error occurred while executing the PowerShell command.');
// } finally {
//   ps.dispose();
// }
// // res.status(200).send("Done");
// });

router.post("/new", async (req, res) => {
    const username = 'ssawant';
  const password = 'Sidhoji100@';

  const connectCommand = `$securePassword = ConvertTo-SecureString -String '${password}' -AsPlainText -Force; $credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList ('${username}', $securePassword); $session = New-PSSession -ComputerName 'hdc505lbwtsv004.lab1.hdc.mdsol.com' -Credential $credential`;
  const invokeCommand = 'Invoke-Command -Session $session -ScriptBlock { whoami }';
  const removeSessionCommand = 'Remove-PSSession -Session $session';

  // Construct the PowerShell command
  const command = `powershell.exe -ExecutionPolicy Bypass -Command "${connectCommand}; ${invokeCommand}; ${removeSessionCommand}"`;

  // Execute the PowerShell command
  exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('An error occurred while executing the PowerShell command.');
    }

    if (stderr) {
      console.error(`PowerShell Error: ${stderr}`);
      return res.status(500).send('An error occurred while executing the PowerShell command.');
    }

    console.log(`PowerShell Output: ${stdout}`);
    return res.send(stdout);
  });


});
module.exports = router


