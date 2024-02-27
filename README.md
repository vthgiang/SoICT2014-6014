# qlcv
# SETUP & RUN PROJECT
-----------------------------------------
Thông tin chi tiết được mô tả trong file project_description.docx, bao gồm cả :
1. Giới thiệu
2. Cấu trúc dữ liệu
3. Demo
4. Cách cài đặt
5. Tài liệu tham khảo



## Git Flow

- Tách nhánh
```
# Chuyển sang nhánh master
$ git checkout master
# Lấy code từ nhánh master
$ git pull origin master
# Tạo nhánh mới
$ git checkout -b <branch_name>
```
- Commit code
```
# Xem trạng thái file
$ git status
# Thêm file vào stage
$ git add <file_name>
# Kiểm tra lại trạng thái file
$ git status
# Commit code
$ git commit -m "<message>"
# Lưu ý message commit phải đầy đủ nội dung, không viết chung chung như fix code, update code, ...
```

- Gộp commit code
```
#Kiểm tra số lượng commit từ commit hiện tại đến commit trước đó
$ git log --oneline
# Nếu có 2 commit trở lên tính từ pull request gần nhất thì gộp commit
$ git rebase -i HEAD~<số lượng commit>
# example: git rebase -i HEAD~2 (gộp 2 commit)
# Trong file editor hiện ra, chọn pick ở commit cuối cùng, chọn squash ở các commit còn lại
# Lưu lại file
# Trong file editor tiếp theo hiện ra, nhập message cho commit
# Lưu lại file
# Kiểm tra lại số lượng commit
$ git log --oneline
# Push code lên nhánh
$ git push origin <branch_name>
```

- Kiểm tra lại và cập nhật thay đổi mới nhất có thể phát sinh so với nhánh master
```
# Cập nhật git reference
$ git fetch origin
# Trong trường hợp nhánh master có thay đổi mới nhất
$ git pull --rebse origin master
# Nếu có conflict thì giải quyết conflict
# Kiểm tra lại trạng thái file
$ git status
# Tiếp tục rebase   
$ git rebase --continue
# Push code lên nhánh
$ git push -f origin <branch_name>
```

- Tạo pull request
- Kiểm tra lại code trên pull request
- Assign pull request cho người review
- Người review kiểm tra lại code, nếu có thay đổi thì comment trên pull request
- Người code sửa code theo comment
- Người code push code lên nhánh
- Người review kiểm tra lại code, nếu không có thay đổi thì merge code vào nhánh master, xoá nhánh đã tạo
