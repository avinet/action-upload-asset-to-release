# action-upload-asset-to-release

Upload an asset to release. For use on release trigger.

Usage:

```yaml
- name: Upload asset to release
  uses: avinet/action-upload-asset-to-release@v3
  with:
    file: ./path/to/file.ext
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

The automatically provided secret `GITHUB_TOKEN` can be used here.
