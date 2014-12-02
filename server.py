import os
import server_settings
import tornado.web
import tornado.httpserver


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler)
        ]
        settings = {
            "template_path": server_settings.TEMPLATE_PATH,
            "static_path": server_settings.STATIC_PATH,
        }
        tornado.web.Application.__init__(self, handlers, **settings)


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


def main():
    applicaton = Application()
    http_server = tornado.httpserver.HTTPServer(applicaton)
    port = int(os.environ.get("PORT", 9999))
    http_server.listen(port)

    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
