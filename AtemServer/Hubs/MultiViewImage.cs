using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

namespace AtemServer.Hubs
{
    internal static class MultiViewImage
    {

        public static byte[] Make(string Text)
        {
            var data = new byte[28800];
            Array.Clear(data, 0, data.Length);


            var Black = Color.FromArgb(0, 0, 0, 0);

            var img720 = new Bitmap(320, 40);
            Graphics drawing = Graphics.FromImage(img720);

            drawing.Clear(Black);
            SizeF textSize = drawing.MeasureString(Text, new Font("Arial", 13, FontStyle.Regular));
            Pen bluePen = new Pen(Color.Blue, 2);
            Brush rectBrush = new SolidBrush(Color.FromArgb(255,0,255,0));
            FillRoundedRectangle(drawing, rectBrush, new Rectangle( (int)((320-textSize.Width)/2)-5, 5, (int)textSize.Width+10, 25), 5);
            Brush textBrush = new SolidBrush(Color.Red);
            drawing.DrawString(Text, new Font("Arial", 13, FontStyle.Regular), textBrush, (320-textSize.Width)/2, 8);
            Brush borderBrush = new SolidBrush(Color.Blue);
            DrawRoundedRectangle(drawing, bluePen, new Rectangle((int)((320 - textSize.Width) / 2) - 5, 5, (int)textSize.Width + 10, 25), 5);
            drawing.Save();

            drawing.Dispose();

            var img1080 = new Bitmap(320, 40);
            Graphics drawing1080 = Graphics.FromImage(img1080);
            drawing1080.Clear(Black);
            SizeF textSize1080 = drawing1080.MeasureString(Text, new Font("Arial", 18, FontStyle.Regular));
            Pen bluePen1080 = new Pen(Color.Blue, 2);

            FillRoundedRectangle(drawing1080, rectBrush, new Rectangle((int)((320 - textSize1080.Width) / 2) - 5, 5, (int)textSize1080.Width + 10, 34), 5);

            drawing1080.DrawString(Text, new Font("Arial", 18, FontStyle.Regular), textBrush, (320 - textSize1080.Width) / 2, 8);

            DrawRoundedRectangle(drawing1080, bluePen1080, new Rectangle((int)((320 - textSize1080.Width) / 2) - 5, 5, (int)textSize1080.Width + 10, 34), 5);
            drawing1080.Save();
            textBrush.Dispose();
            drawing1080.Dispose();


            for (int i = 0; i < img720.Width; i++)
            {
                for (int j = 0; j < img720.Height; j++)
                {
                    Color pixel = img720.GetPixel(i, j);
                    if (pixel.R > 120)
                    {
                        data[16000 + ((j * 320) + i)] = 125; //720 Labels
                    }
                    else if (pixel.R > 0)
                    {
                       data[16000 + ((j * 320) + i)] = 60;
                    }
                    else if (pixel.B > 0)
                    {
                        data[16000 + ((j * 320) + i)] = 200;
                    }
                    else if (pixel.G > 200)
                    {
                        data[16000 + ((j * 320) + i)] = 2;
                    }
                    else if (pixel.G > 0)
                    {
                        data[16000 + ((j * 320) + i)] = 60;
                    }
                    else if (pixel.B > 120)
                    {
                        data[16000 + ((j * 320) + i)] = 200;
                    }

                }
            }

            for(int i = 0; i < img1080.Width; i++)
            {
                for (int j = 0; j < img1080.Height; j++)
                {
                    Color pixel = img1080.GetPixel(i, j);
                    if (pixel.R > 120)
                    {
                        data[0 + ((j * 320) + i)] = 125; //720 Labels
                    }
                    else if (pixel.R > 0)
                    {
                        data[0 + ((j * 320) + i)] = 60;
                    }
                    else if (pixel.B > 0)
                    {
                        data[0 + ((j * 320) + i)] = 200;
                    }
                    else if (pixel.G > 200)
                    {
                        data[0 + ((j * 320) + i)] = 2;
                    }
                    else if (pixel.G > 0)
                    {
                        data[0 + ((j * 320) + i)] = 60;
                    }
                    else if (pixel.B > 120)
                    {
                        data[0 + ((j * 320) + i)] = 200;
                    }

                }
            }

            return data;
        }


        private static GraphicsPath RoundedRect(Rectangle bounds, int radius)
        {
            int diameter = radius * 2;
            Size size = new Size(diameter, diameter);
            Rectangle arc = new Rectangle(bounds.Location, size);
            GraphicsPath path = new GraphicsPath();

            if (radius == 0)
            {
                path.AddRectangle(bounds);
                return path;
            }

            // top left arc  
            path.AddArc(arc, 180, 90);

            // top right arc  
            arc.X = bounds.Right - diameter;
            path.AddArc(arc, 270, 90);

            // bottom right arc  
            arc.Y = bounds.Bottom - diameter;
            path.AddArc(arc, 0, 90);

            // bottom left arc 
            arc.X = bounds.Left;
            path.AddArc(arc, 90, 90);

            path.CloseFigure();
            return path;
        }

        private static void DrawRoundedRectangle(this Graphics graphics, Pen pen, Rectangle bounds, int cornerRadius)
        {
            if (graphics == null)
                throw new ArgumentNullException("graphics");
            if (pen == null)
                throw new ArgumentNullException("pen");

            using (GraphicsPath path = RoundedRect(bounds, cornerRadius))
            {
                graphics.DrawPath(pen, path);
            }
        }

        private static void FillRoundedRectangle(this Graphics graphics, Brush brush, Rectangle bounds, int cornerRadius)
        {
            if (graphics == null)
                throw new ArgumentNullException("graphics");
            if (brush == null)
                throw new ArgumentNullException("brush");

            using (GraphicsPath path = RoundedRect(bounds, cornerRadius))
            {
                graphics.FillPath(brush, path);
            }
        }
    }
}
