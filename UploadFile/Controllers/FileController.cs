using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UploadFile.Controllers
{
    public class FileController : Controller
    {
        // GET: File
        public ActionResult UploadFile()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SaveFile()
        {
            //   用表单action 上传 文件    没有提交文件 cout也是1     有问题   所以在下面在 判断一层   获取的名称时候 为空
            if (Request.Files.Count > 0)
            {
                if (string.IsNullOrEmpty(Request.Files[0].FileName))
                {
                    Request.Files[0].SaveAs(Server.MapPath("~/App_Data/") + Request.Files[0].FileName);
                    return RedirectToAction("UploadFile", Content("保存成功"));
                }
                Math.Min(1, 1);
            }
            return Content("<script >alert('请选择 文件');</script >", "text/html");

        }

        /// <summary>
        /// HTML5  fromData  上传 文件
        /// </summary>
        /// <returns> 返回 结果</returns>
        public string SaveUpload()
        {
            string str = string.Empty;
            if (Request.Files.Count > 0)  // 这个  是不是 
            {
                Request.Files[0].SaveAs(Server.MapPath("~/UploadFile/") + Path.GetFileName(Request.Files[0].FileName));
                str = "保存成功";
            }
            else
                str = "没有读到文件";

            return str;
        }

        /// <summary>
        ///  上传大文件的时候     需要一点一点的 上传  要不上传不了
        /// </summary>
        /// <returns></returns>
        public string BlockUpload()
        {
            string str = string.Empty;
            try
            {
                // 
                var filePath = Server.MapPath("~/UploadFile/") + Request.Form["fileName"];
                //创建一个追加（FileMode.Append）方式的文件流
                using (FileStream fs = new FileStream(filePath, FileMode.Append, FileAccess.Write))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {
                        //读取文件流
                        BinaryReader br = new BinaryReader(Request.Files[0].InputStream);
                        //将文件留转成字节数组
                        byte[] bytes = br.ReadBytes((int)Request.Files[0].InputStream.Length);
                        //将字节数组追加到文件
                        bw.Write(bytes);
                    }
                }
                str = "保存成功";
            }
            catch (Exception ex)
            {
                str = ex.Message.ToString();
            }
            return str;
        }

        /// <summary>
        ///  文件 拖拽
        /// </summary>
        /// <returns></returns>
        public string FileOnDrop()
        {
            string str = string.Empty;
            if (Request.Files.Count > 0)  // 这个  是不是 
            {

                Request.Files[0].SaveAs(Server.MapPath("~/UploadFile/") + Path.GetFileName(Request.Files[0].FileName));
                str = "保存成功";
            }
            else
                str = "没有读到文件";
            return str;
        }

        /// <summary>
        ///  文件 粘贴
        /// </summary>
        /// <returns></returns>
        public string FileOnPaste()
        {

            //  var filePath = Server.MapPath("~/App_Data/") + Request.Form["fileName"];     使用这个 方法的时候   
            // 在前台的js  fromData 中    添加  formData.append('fileName', "自定义的名称")  就可以直接获取到这个的名称
            string str = string.Empty;
            //string file = Server.MapPath("~/UploadFile/") + Path.GetFileName(Request.Files[0].FileName);
            string file = Server.MapPath("~/UploadFile/") + Request.Form["fileName"];
            if (Request.Files.Count > 0)
            {
                Request.Files[0].SaveAs(file);
                str = "保存成功";
            }
            else
                str = "没有读到文件";
            return str;
        }

    }


}