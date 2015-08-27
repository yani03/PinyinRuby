using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.IO;
using System.Text;

namespace ReadingBuilder
{
	public static class Program
	{
		public static void Main (string[] args)
		{
			var outputFilename = args[1];
			var inputFilename = args[0];
			var input = File
				.ReadAllLines (inputFilename)
				.Where (line => line.Length > 0 && !line.StartsWith ("#"))
				.Select (line =>
				{
					var pos1 = line.IndexOf ('\t');
					var pos2 = line.IndexOf ('\t', pos1 + 1);
					return Tuple.Create (
						line.Substring (0, pos1),
						line.Substring (pos1 + 1, pos2 - pos1 - 1),
						line.Substring (pos2 + 1));
				})
				.Where (temp => temp.Item1.Length >= 6 && temp.Item2 == "kMandarin")
				.Select (temp =>
				{
					var codeString = temp.Item1.Substring (2);
					var code = Char.ConvertFromUtf32 (int.Parse (codeString, NumberStyles.AllowHexSpecifier));
					var read = temp.Item3;
					return Tuple.Create (code, read);
				});
			var replaceMap = new Dictionary<string, string>
			{
				{ "ā", "a1" }, { "á", "a2" }, { "ǎ", "a3" }, { "à", "a4" },
				{ "ī", "i1" }, { "í", "i2" }, { "ǐ", "i3" }, { "ì", "i4" },
				{ "ū", "u1" }, { "ú", "u2" }, { "ǔ", "u3" }, { "ù", "u4" },
				{ "ē", "e1" }, { "é", "e2" }, { "ě", "e3" }, { "è", "e4" },
				{ "ō", "o1" }, { "ó", "o2" }, { "ǒ", "o3" }, { "ò", "o4" },
				{ "ǖ", "v1" }, { "ǘ", "v2" }, { "ǚ", "v3" }, { "ǜ", "v4" }, { "ü", "v" },
			};
			var lines = new StringBuilder ();
			lines.Append ("{");
			foreach (var temp in input)
			{
				var code = temp.Item1;
				var read1 = temp.Item2;
				//var read2 = temp.Item2;
				//foreach (var replace in replaceMap)
				//{
				//	read2 = read2.Replace (replace.Key, replace.Value);
				//}
				//lines.AppendFormat ("\"{0}\":[\"{1}\",\"{2}\"],", code, read1, read2);
				lines.AppendFormat ("\"{0}\":\"{1}\",", code, read1);
			}
			lines.Remove (lines.Length - 1, 1);
			lines.Append ("}");
			File.WriteAllText (outputFilename, lines.ToString ());
		}
	}
}
