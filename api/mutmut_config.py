import os.path


def pre_mutation(context):
    if str(context.filename).endswith('_test.py'):
        context.skip = True

    dirname, filename = os.path.split(context.filename)
    basename = os.path.basename(dirname)
    root, ext = os.path.splitext(filename)
    testfile = root + "_test" + ext
    if root == "__init__":
        testfile = basename + "_test" + ext
    context.config.test_command += ' ' + os.path.join(dirname, testfile)
