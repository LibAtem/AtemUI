using System;
using System.IO;

namespace TypesGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            using (var commonEnumsFile = new StreamWriter("../../../../client/src/generated/common-enums.ts"))
            {
                CommonEnumsSpecGenerator.RunIt(commonEnumsFile);
            }
            using (var commandsFile = new StreamWriter("../../../../client/src/generated/commands.ts"))
            {
                CommandSpecGenerator.RunIt(commandsFile);
            }

        }
    }
}