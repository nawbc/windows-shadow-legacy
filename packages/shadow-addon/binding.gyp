{
  "variables": {
    "windows_include": "C:/Program Files (x86)/Windows Kits/10/",
  },
  "targets": [
    {
      "target_name": "winwin",
      "sources": [
        "src/main.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        # 包含windows kit
        "<(windows_include)",
      ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1
        }
      },
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS'],
    }
  ]
}