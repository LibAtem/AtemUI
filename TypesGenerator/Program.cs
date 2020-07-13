using System;
using System.IO;
using LibAtem.DeviceProfile;
using LibAtem.State;

namespace TypesGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            using (var commonEnumsFile = new StreamWriter("../client/src/generated/common-enums.ts"))
            {
                CommonEnumsSpecGenerator.RunIt(commonEnumsFile);
            }
            using (var commandsFile = new StreamWriter("../client/src/generated/commands.ts"))
            {
                CommandSpecGenerator.RunIt(commandsFile);
            }
            using (var stateFile = new StreamWriter("../client/src/generated/state.ts"))
            {
                new ClassSpecGenerator(stateFile, "LibAtem.State.", typeof(AtemState)).RunIt("LibAtem.State.AtemState");
            }
            using (var profileFile = new StreamWriter("../client/src/generated/profile.ts"))
            {
                new ClassSpecGenerator(profileFile, "LibAtem.DeviceProfile.", typeof(DeviceProfile)).RunIt("LibAtem.DeviceProfile.DeviceProfile");
            }

        }
    }
}